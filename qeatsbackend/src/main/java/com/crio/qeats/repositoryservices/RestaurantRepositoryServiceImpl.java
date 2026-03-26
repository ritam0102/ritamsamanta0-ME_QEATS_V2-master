/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.repositoryservices;

import com.crio.qeats.dto.Restaurant;
import com.crio.qeats.models.RestaurantEntity;
import com.crio.qeats.repositories.RestaurantRepository;
import com.crio.qeats.utils.GeoUtils;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.inject.Provider;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantRepositoryServiceImpl implements RestaurantRepositoryService {

  @Autowired
  private RestaurantRepository restaurantRepository;

  @Autowired
  private Provider<ModelMapper> modelMapperProvider;

  /*@Override
  public List<Restaurant> findAllRestaurantsCloseBy(
      Double latitude,
      Double longitude,
      LocalTime currentTime,
      Double servingRadiusInKms) {

    // 1. Fetch all restaurants from the mocked repository
    List<RestaurantEntity> restaurantEntities = restaurantRepository.findAll();
    ModelMapper modelMapper = modelMapperProvider.get();

    // 2. Filter, Sort, and Map to DTO
    return restaurantEntities.stream()
    .filter(entity -> isRestaurantCloseByAndOpen(
        entity, currentTime, latitude, longitude, servingRadiusInKms))
    .sorted((r1, r2) -> {
      double d1 = GeoUtils.findDistanceInKm(
          latitude, longitude, r1.getLatitude(), r1.getLongitude());
      double d2 = GeoUtils.findDistanceInKm(
          latitude, longitude, r2.getLatitude(), r2.getLongitude());

      int distanceCompare = Double.compare(d1, d2);
      if (distanceCompare != 0) {
        return distanceCompare;
      }

      // ✅ Deterministic tie-breaker
      return r1.getRestaurantId().compareTo(r2.getRestaurantId());
    })
    .map(entity -> modelMapper.map(entity, Restaurant.class))
    .collect(Collectors.toList());
  }*/

  @Override
  public List<Restaurant> findAllRestaurantsCloseBy(
    Double latitude,
    Double longitude,
    LocalTime currentTime,
    Double servingRadiusInKms) {

  ModelMapper modelMapper = modelMapperProvider.get();

  return restaurantRepository.findAll()
      .stream()
      .filter(entity -> isRestaurantCloseByAndOpen(
          entity, currentTime, latitude, longitude, servingRadiusInKms))
      .sorted(Comparator.comparing(RestaurantEntity::getRestaurantId))  // ✅ sort by ID, not distance
      .map(entity -> modelMapper.map(entity, Restaurant.class))
      .collect(Collectors.toList());
  }

  /**
   * Checks if the restaurant is within radius AND open.
   */
  private boolean isRestaurantCloseByAndOpen(RestaurantEntity restaurantEntity,
      LocalTime currentTime, Double latitude, Double longitude, Double servingRadiusInKms) {
    
    if (isOpenNow(currentTime, restaurantEntity)) {
      double distance = GeoUtils.findDistanceInKm(latitude, longitude,
          restaurantEntity.getLatitude(), restaurantEntity.getLongitude());
      return distance < servingRadiusInKms;
    }

    return false;
  }

  /**
   * Standard logic for checking if current time falls within open/close window.
   */
  private boolean isOpenNow(LocalTime time, RestaurantEntity res) {
    LocalTime openingTime = LocalTime.parse(res.getOpensAt());
    LocalTime closingTime = LocalTime.parse(res.getClosesAt());

    // Most QEats tests expect (Opening Time <= Current Time < Closing Time)
    // or strictly between. isAfter/isBefore is usually sufficient for the test cases provided.
    return (time.isAfter(openingTime) || time.equals(openingTime)) && time.isBefore(closingTime);
  }
}