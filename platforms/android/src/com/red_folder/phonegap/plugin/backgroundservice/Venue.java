package com.red_folder.phonegap.plugin.backgroundservice;

import com.google.android.gms.maps.model.LatLng;

public class Venue {
	
	public String id;
	public String name;
	public String category;
	public double distance;
	public String first_image_url;
	public LatLng position;
	public double scoreFB;
	public double scoreBH;
	
	public Venue(String id, String name, String category, double distance, LatLng position, String first_image_url, double scoreFB, double scoreBH) {
		
		this.id = id;
		this.name = name;
		this.category = category;
		this.distance = distance;
		this.first_image_url = first_image_url;
		this.position = position;
	}
}
