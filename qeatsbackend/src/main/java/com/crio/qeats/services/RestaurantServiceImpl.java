
/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.services;

import com.crio.qeats.dto.Restaurant;
import com.crio.qeats.exchanges.GetRestaurantsRequest;
import com.crio.qeats.exchanges.GetRestaurantsResponse;
import com.crio.qeats.repositoryservices.RestaurantRepositoryService;
import java.time.LocalTime;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class RestaurantServiceImpl implements RestaurantService {

  private final Double peakHoursServingRadiusInKms = 3.0;
  private final Double normalHoursServingRadiusInKms = 5.0;
  @Autowired
  private RestaurantRepositoryService restaurantRepositoryService;


  @Override
  public GetRestaurantsResponse findAllRestaurantsCloseBy(
      GetRestaurantsRequest getRestaurantsRequest, LocalTime currentTime) {

    Double servingRadiusInKms = isPeakHour(currentTime) 
        ? peakHoursServingRadiusInKms 
        : normalHoursServingRadiusInKms;

    log.info("Finding restaurants for Lat: {}, Long: {} with Radius: {} km at time: {}",
        getRestaurantsRequest.getLatitude(), 
        getRestaurantsRequest.getLongitude(), 
        servingRadiusInKms, 
        currentTime);

    // Call Repository Service to get the list of open restaurants within the radius
    List<Restaurant> restaurants = restaurantRepositoryService.findAllRestaurantsCloseBy(
        getRestaurantsRequest.getLatitude(),
        getRestaurantsRequest.getLongitude(),
        currentTime,
        servingRadiusInKms);

    return new GetRestaurantsResponse(restaurants);
  }

  /**
   * Helper method to determine if the current time falls within peak hours.
   * Peak hours: 8AM-10AM, 1PM-2PM, 7PM-9PM.
   */
  private boolean isPeakHour(LocalTime time) {
    int hour = time.getHour();
    int minute = time.getMinute();

    // Breakfast: 08:00 - 10:00
    if (hour >= 8 && (hour < 10 || (hour == 10 && minute == 0))) {
      return true;
    }
    // Lunch: 13:00 - 14:00
    if (hour >= 13 && (hour < 14 || (hour == 14 && minute == 0))) {
      return true;
    }
    // Dinner: 19:00 - 21:00
    if (hour >= 19 && (hour < 21 || (hour == 21 && minute == 0))) {
      return true;
    }

    return false;
  }
}

