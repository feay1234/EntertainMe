package com.red_folder.phonegap.plugin.backgroundservice;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Timer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;
import gla.ac.uk.entertainme.R;

import com.google.android.gms.maps.model.LatLng;
import com.red_folder.phonegap.plugin.backgroundservice.MyLocation.LocationResult;


public class MyService extends BackgroundService {
	
	private final static String TAG = MyService.class.getSimpleName();
	
	private String favorite_string = "";
	private String like_string = "";
	private String behaviour_string = "";
	
	private static JSONArray user_favorite = new JSONArray();
	public static JSONArray user_likes = new JSONArray();
	public static JSONArray user_behaviour = new JSONArray();
	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();

		Log.e("Thread", "[{'category':'test'}]" );
        Log.e("Thread", like_string.length()+"12");
        try {
//			user_likes = new JSONArray("[{'category':'test'}]");
        	user_likes = new JSONArray(like_string);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        Log.e("Thread", behaviour_string);
//		try {
//			if(!favorite_string.equals("[]")){
//				Log.e(TAG, favorite_string);
//				user_favorite = new JSONArray(favorite_string);
//				for (int i = 0; i < user_favorite.length(); i++) {
////					Log.e(TAG, user_favorite.getJSONObject(i).getString("category"));
////					JSONArray user_favorite = new JSONArray("[{'category':'test'}, {'category':'test2'}]");
//				}
//			}
//			if(!like_string.equals("[]")){
//				Log.e(TAG, like_string);
//				user_likes = new JSONArray(like_string);
//				for (int i = 0; i < user_likes.length(); i++) {
////					Log.e(TAG, user_likes.getJSONObject(i).getString("category"));
//				}
//			}
//			if(!behaviour_string.equals("[]")){
//				Log.e(TAG, behaviour_string);
//				user_behaviour = new JSONArray(behaviour_string);
//				for (int i = 0; i < user_behaviour.length(); i++) {
////					Log.e(TAG, user_behaviour.getJSONObject(i).getString("category"));
//				}
//			}
//			
//		} catch (JSONException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		TrackerThread test = new TrackerThread();
		test.run();
		
		
		
		return result;
	}
	

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();
		
		try {
			result.put("test", "test");
		} catch (JSONException e) {
		}
		
		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("user_favorite")){
				favorite_string = config.getString("user_favorite");
			}
			if (config.has("user_likes")){
				this.like_string = config.getString("user_likes");
			}
			if (config.has("user_behaviour"))
				this.behaviour_string = config.getString("user_behaviour");
		} catch (JSONException e) {
		}
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub
		
	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub
		
	}

	class TrackerThread extends Thread {
	    public Handler mHandler;
	    public int sleep_time = 5000;
	    public int check = 1;
	    public LatLng previous_location = new LatLng(55.8741905, -4.2922399);
	    
	    public void run() {
	    	Log.e("Thread", "First Run");
	        Looper.prepare();
	        try {
	            while (true) {
	            	Log.e("Thread", "processing :"+check);
	            	LocationResult locationResult = new LocationResult() {
	        			
	    				@Override
	    				public void gotLocation(Location location) {
	    					LatLng current_location = new LatLng(location.getLatitude(), location.getLongitude());
	    					Log.e("Thread", "Get New Location :"+check);
	    					Log.e("Thread", "Increment Sleep Time");
	    					Log.e("Thread", location.getLatitude()+" "+location.getLongitude());
	    					Log.e("Thread", "Distance :"+distance(previous_location.latitude, previous_location.longitude, current_location.latitude, current_location.longitude, 'M'));
	    	                
	    	                if(distance(previous_location.latitude, previous_location.longitude, location.getLatitude(), location.getLongitude(), 'M') < 0.1){
	    	                	
	    	                	new Foursquare(current_location){
    	                		  protected void onPostExecute(String results) {
      	                			  try {
      	                				  JSONObject jsonarr = new JSONObject(results);
      	                				  
      	                				  JSONArray venues;
											if(jsonarr.getJSONObject("response").has("venues")){
												venues = jsonarr.getJSONObject("response").getJSONArray("venues");
											}
											else{
												venues = jsonarr.getJSONObject("response").getJSONArray("groups").getJSONObject(0).getJSONArray("items");
												Log.e("Thread","second condition");
											}
											
//											user favorite ranking
											for (int i = 0; i < venues.length(); i++) {
												JSONObject venue = venues.getJSONObject(i).getJSONObject("venue");
												Venue v = FoursquareJSON.parseFoursquareJSON(venue, user_favorite, user_likes, user_behaviour);
	      									}
											
											
      									
      	                			  } catch (JSONException e) {
      	                				  // TODO Auto-generated catch block
      	                				  e.printStackTrace();
      	                			  } catch(Exception e){
      	                				  e.printStackTrace();
      	                			  }
      	                			  
      	                			 
      	                		  }
      	                		  
      	                	  }.execute();
	    	                }
	    					sendNotification("test",location.getLatitude());
	    					sleep_time = 10000;
	    					check++;
	    				}
	    			};
	    			MyLocation myLocation = new MyLocation();
	    			myLocation.getLocation(getApplicationContext(), locationResult);
	    			Log.e("Thread", "Sleep for "+sleep_time+"mins");
	    			Thread.sleep(sleep_time);
	    			
	    			
	    			
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        }

	        Looper.loop();
	        
	    }
	    
	    public void sendNotification(String name, double distance){
			NotificationCompat.Builder mBuilder =
			        new NotificationCompat.Builder(getBaseContext())
					.setSmallIcon(R.drawable.icon)
			        .setContentTitle("Entertain Me")
			        .setContentText("You may like to visit "+name+". it's just "+distance+" miles away from here");
			
			mBuilder.setAutoCancel(true);
			
			
			NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			// mId allows you to update the notification later on.
			int mId = 0;
			mNotificationManager.notify(mId, mBuilder.build());
		}
	    
	    private double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
		      double theta = lon1 - lon2;
		      double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		      dist = Math.acos(dist);
		      dist = rad2deg(dist);
		      dist = dist * 60 * 1.1515;
		      if (unit == 'K') {
		        dist = dist * 1.609344;
		      } else if (unit == 'N') {
		        dist = dist * 0.8684;
		        }
		      return (dist);
	    }

	    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	    /*::  This function converts decimal degrees to radians             :*/
	    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	    private double deg2rad(double deg) {
	      	return (deg * Math.PI / 180.0);
	    }

	    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	    /*::  This function converts radians to decimal degrees             :*/
	    /*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	    private double rad2deg(double rad) {
	      	return (rad * 180.0 / Math.PI);
	    }
	}

}
