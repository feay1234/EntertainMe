package com.red_folder.phonegap.plugin.backgroundservice;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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
	
	public static List<Venue> sortByBHFB(List<Venue> p){
		Collections.sort(p, new Comparator<Venue>() {
			@Override
			public int compare(Venue arg0, Venue arg1) {
				int score1 = Double.compare(arg0.scoreBH, arg1.scoreBH);
				if(score1 == 0){
					return Double.compare(arg0.scoreFB, arg1.scoreFB);
				}
				return score1;
			}
	    });
		return p;
	}
}
