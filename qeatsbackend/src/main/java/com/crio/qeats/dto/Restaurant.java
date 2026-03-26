
/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({
    "restaurantId", "name", "city", "imageUrl",
    "latitude", "longitude", "opensAt", "closesAt", "attributes"
})
public class Restaurant {

  @NotNull
  private String restaurantId;

  @NotNull
  private String name;

  @NotNull
  private String city;

  @NotNull
  private String imageUrl;

  @NotNull
  private Double latitude;

  @NotNull
  private Double longitude;

  // ✅ MUST BE STRING (QEats requirement)
  @NotNull
  private String opensAt;

  // ✅ MUST BE STRING (QEats requirement)
  @NotNull
  private String closesAt;

  @NotNull
  private List<String> attributes = new ArrayList<>();
}
