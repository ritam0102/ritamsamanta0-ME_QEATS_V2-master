/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.controller;

import com.crio.qeats.exchanges.GetRestaurantsRequest;
import com.crio.qeats.exchanges.GetRestaurantsResponse;
import com.crio.qeats.services.RestaurantService;
import java.time.LocalTime;
import javax.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RestaurantController.RESTAURANT_API_ENDPOINT)
public class RestaurantController {

  public static final String RESTAURANT_API_ENDPOINT = "/qeats/v1";
  public static final String RESTAURANTS_API = "/restaurants";
  public static final String MENU_API = "/menu";
  public static final String CART_API = "/cart";
  public static final String CART_ITEM_API = "/cart/item";
  public static final String CART_CLEAR_API = "/cart/clear";
  public static final String POST_ORDER_API = "/order";
  public static final String GET_ORDERS_API = "/orders";

  // Using LogManager to bypass the VS Code Lombok "log" error
  private static final Logger log = LogManager.getLogger(RestaurantController.class);

  private final RestaurantService restaurantService;

  @Autowired
  public RestaurantController(RestaurantService restaurantService) {
    this.restaurantService = restaurantService;
  }

  @GetMapping(RESTAURANTS_API)
  public ResponseEntity<GetRestaurantsResponse> getRestaurants(
      @Valid GetRestaurantsRequest getRestaurantsRequest) {

    log.info("getRestaurants called with {}", getRestaurantsRequest);

    GetRestaurantsResponse getRestaurantsResponse = restaurantService
        .findAllRestaurantsCloseBy(getRestaurantsRequest, LocalTime.now());

    // Fix for "method undefined" error: Ensure null checks before calling the getter
    if (getRestaurantsResponse != null && getRestaurantsResponse.getRestaurants() != null) {
      log.info("getRestaurants returned {} restaurants", 
          getRestaurantsResponse.getRestaurants().size());
    }

    return ResponseEntity.ok().body(getRestaurantsResponse);
  }

  @GetMapping(MENU_API)
  public ResponseEntity<?> getMenu(@RequestParam String restaurantId) {
    log.info("getMenu called for restaurantId: {}", restaurantId);
    return ResponseEntity.ok().build();
  }

  @PostMapping(CART_ITEM_API)
  public ResponseEntity<?> addItemToCart() {
    return ResponseEntity.ok().build();
  }

  @DeleteMapping(CART_ITEM_API)
  public ResponseEntity<?> removeItemFromCart() {
    return ResponseEntity.ok().build();
  }

  @DeleteMapping(CART_CLEAR_API)
  public ResponseEntity<?> clearCart(@RequestParam String cartId) {
    return ResponseEntity.ok().build();
  }

  @PostMapping(POST_ORDER_API)
  public ResponseEntity<?> postOrder() {
    return ResponseEntity.ok().build();
  }

  @GetMapping(GET_ORDERS_API)
  public ResponseEntity<?> getOrders() {
    return ResponseEntity.ok().build();
  }
}
