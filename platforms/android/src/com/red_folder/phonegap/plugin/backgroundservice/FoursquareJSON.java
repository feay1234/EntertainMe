package com.red_folder.phonegap.plugin.backgroundservice;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.google.android.gms.maps.model.LatLng;

public class FoursquareJSON {
	
	public static Venue parseFoursquareJSON(JSONObject venue, JSONArray user_favorite, JSONArray user_likes, JSONArray user_behaviour) throws JSONException{
		
		
		String id = venue.getString("id");
		String name = venue.getString("name");
		
		String category = "";
		if(venue.getJSONArray("categories").getJSONObject(0).has("name"))
    		category = venue.getJSONArray("categories").getJSONObject(0).getString("name");
		
		LatLng position = new LatLng(venue.getJSONObject("location").getDouble("lat"), venue.getJSONObject("location").getDouble("lng"));
		
		double distance = 0;
		if(venue.getJSONObject("location").has("distance"))
	    	distance  = venue.getJSONObject("location").getDouble("distance");
		
		String first_image_url = "";
		if(venue.has("photos")){
			if(venue.getJSONObject("photos").has("groups")){
				JSONArray image_group = venue.getJSONObject("photos").getJSONArray("groups");
				if(image_group.length()>0){
					JSONArray image_items = image_group.getJSONObject(0).getJSONArray("items");
					if(image_items.length() > 0){
						first_image_url = image_items.getJSONObject(0).getString("prefix")+"80x80"+image_items.getJSONObject(0).getString("suffix");
					}
				}
			}
	    }
//		Log.e("FoursquareJSON", id+" "+name+" "+category+" "+position.toString()+" "+distance+" "+first_image_url);
		
		double scoreFB = 2147483647;
		double scoreBH = 2147483647;
		
		for (int i = 0; i < user_likes.length(); i++) {
			double score = DamerauLevenshteinAlgorithm.execute(category, user_likes.getJSONObject(i).getString("category"));
			Log.e("scoreFB", score+"");
			if(scoreFB > score){
				scoreFB = score;
			}
		}
		for (int i = 0; i < user_favorite.length(); i++) {
			double score = DamerauLevenshteinAlgorithm.execute(category, user_favorite.getJSONObject(i).getString("category"));
			Log.e("scoreFavorite", score+"");
			if(scoreFB > score){
				scoreFB = score;
			}
		}
		for (int i = 0; i < user_behaviour.length(); i++) {
			double score = DamerauLevenshteinAlgorithm.execute(category, user_behaviour.getJSONObject(i).getString("venue_category"));
			Log.e("scoreBH", score+"");
			if(scoreBH > score){
				scoreBH = score;
			}
		}
//		Log.e("FoursquareJSON", scoreFB+" "+scoreBH);
		Venue v = new Venue(id, name, category, distance, position, first_image_url, scoreFB, scoreBH);
		return v;
		
	}
}
