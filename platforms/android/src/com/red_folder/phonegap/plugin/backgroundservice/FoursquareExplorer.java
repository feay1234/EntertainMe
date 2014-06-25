package com.red_folder.phonegap.plugin.backgroundservice;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;

import android.os.AsyncTask;
import android.util.Log;

import com.google.android.gms.maps.model.LatLng;

public class FoursquareExplorer extends AsyncTask<Void, Void, String> {

	private LatLng userLatLng;
	private String category;

	// facebook variables
	private String facebookID;
	private String accessToken;

	// required variables in class
	private String exploreUrl;
	private HttpGet httpGet;
	private HttpResponse response;
	private HttpEntity entity;
	private String mode;

	

	public FoursquareExplorer(LatLng userLatLng, String category, String mode) {
		this.userLatLng = userLatLng;
		this.category = category;
		this.mode = mode;
		

	}

	public FoursquareExplorer(LatLng userLatLng, String facebookID, String accessToken, String mode) {
		this.userLatLng = userLatLng;
		this.facebookID = facebookID;
		this.accessToken = accessToken;
		this.mode = mode;
	}
	

	protected String getASCIIContentFromEntity(HttpEntity entity)
			throws IllegalStateException, IOException {
		InputStream in = entity.getContent();
		StringBuffer out = new StringBuffer();
		int n = 1;
		while (n > 0) {
			byte[] b = new byte[4096];
			n = in.read(b);
			if (n > 0)
				out.append(new String(b, 0, n));
		}
		return out.toString();
	}

	@Override
	protected String doInBackground(Void... params) {
		HttpClient httpClient = new DefaultHttpClient();
		HttpContext localContext = new BasicHttpContext();
		String text = null;
		try {
			if (mode == "MyRanking")
				exploreUrl = "https://api.foursquare.com/v2/venues/explore?ll="	+ userLatLng.latitude+ ","+ userLatLng.longitude+ "&query="	+category+ "&limit=12&venuePhotos=1&sortByDistance=1&client_id=5VBHVYNQEJXS1K0MK0YW4NTXBJCCT3VGNMOX0WVCLQZDR1FC&client_secret=HSL2BVQRIGCUSMZ51EXIP1JXEWITIAI5SPGKQ0GAKGI12RD5&v=20140605";
			else if( mode == "NotificationService")
				exploreUrl = "https://api.foursquare.com/v2/venues/explore?ll="	+ userLatLng.latitude+ ","+ userLatLng.longitude+ "&query="	+category+ "&limit=12&venuePhotos=1&sortByDistance=1&client_id=5VBHVYNQEJXS1K0MK0YW4NTXBJCCT3VGNMOX0WVCLQZDR1FC&client_secret=HSL2BVQRIGCUSMZ51EXIP1JXEWITIAI5SPGKQ0GAKGI12RD5&v=20140605";
			else{
				exploreUrl = "http://demos.terrier.org/geohash.json?lng="+ userLatLng.longitude + "&lat=" + userLatLng.latitude+ "&user_id=" + facebookID + "&access_token="+ accessToken;
				Log.e("FoursquareExplorer", userLatLng.longitude+"");
				Log.e("FoursquareExplorer", userLatLng.latitude+"");
				Log.e("FoursquareExplorer", facebookID+"");
				Log.e("FoursquareExplorer", accessToken+"");
			}
			httpGet = new HttpGet(exploreUrl);
			response = httpClient.execute(httpGet, localContext);
			entity = response.getEntity();
			text = getASCIIContentFromEntity(entity);
		} catch (Exception e) {

		}
		return text;
	}
	

	

}
