package com.red_folder.phonegap.plugin.backgroundservice;

import gla.ac.uk.entertainme.EntertainMe;
import gla.ac.uk.entertainme.R;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import com.facebook.LoginActivity;
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
	public Context context = this;
	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
	
        
		try {
			Log.e("fea", "dowork1");
			
			if(favorite_string.length() != 2){
				Log.e("fea", favorite_string+"test");
				Log.e("fea", ""+"test");
				user_favorite = new JSONArray(favorite_string);
			}
			if(like_string.length() != 2){
				Log.e("fea", "dowork2");
				user_likes = new JSONArray(like_string);
			}
			if(behaviour_string.length() != 2){
				Log.e("fea", "dowork3");
				user_behaviour = new JSONArray(behaviour_string);
			}
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
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
	    public int sleep_time = 30000;
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
	    	                
	    	                if(distance(previous_location.latitude, previous_location.longitude, location.getLatitude(), location.getLongitude(), 'M') <= 0.1){
	    	                	previous_location = current_location;
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
											List<Venue> venue_list = new ArrayList();
											for (int i = 0; i < venues.length(); i++) {
												JSONObject venue = venues.getJSONObject(i).getJSONObject("venue");
												Venue v = FoursquareJSON.parseFoursquareJSON(venue, user_favorite, user_likes, user_behaviour);
												venue_list.add(v);
	      									}
											
											venue_list = Venue.sortByBHFB(venue_list);
											if(venue_list.size() >= 0){
												sendNotification(venue_list.get(0).name, venue_list.get(0).distance, venue_list.get(0).first_image_url);
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
	    					sleep_time = 60000;
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
	    
	    @SuppressLint("NewApi")
		public void sendNotification(String name, double distance, String url){
	    	
//	    	Bitmap bitmap = getBitmapFromURL(url);
			NotificationCompat.Builder mBuilder =
			        new NotificationCompat.Builder(getBaseContext())
					.setSmallIcon(R.drawable.icon)
			        .setContentTitle("Entertain Me")
			        .setContentText("You may like to visit "+name+". it's just "+distance+" miles away from here");
			
			mBuilder.setAutoCancel(true);
			
			// Creates an explicit intent for an Activity in your app
			Intent resultIntent = new Intent(context, EntertainMe.class);
			// The stack builder object will contain an artificial back stack for the
			// started Activity.
			// This ensures that navigating backward from the Activity leads out of
			// your application to the Home screen.
			TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
			// Adds the back stack for the Intent (but not the Intent itself)
			stackBuilder.addParentStack(EntertainMe.class);
			// Adds the Intent that starts the Activity to the top of the stack
			stackBuilder.addNextIntent(resultIntent);
			PendingIntent resultPendingIntent =
			        stackBuilder.getPendingIntent(
			            0,
			            PendingIntent.FLAG_UPDATE_CURRENT
			        );
			mBuilder.setContentIntent(resultPendingIntent);
			
			
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
	    
	    public Bitmap getBitmapFromURL(String strURL) {
	        try {
	            URL url = new URL(strURL);
	            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	            connection.setDoInput(true);
	            connection.connect();
	            InputStream input = connection.getInputStream();
	            Bitmap myBitmap = BitmapFactory.decodeStream(input);
	            return myBitmap;
	        } catch (IOException e) {
	            e.printStackTrace();
	            return null;
	        }
	    }
	    
	}

}
