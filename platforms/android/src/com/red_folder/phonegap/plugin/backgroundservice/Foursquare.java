package com.red_folder.phonegap.plugin.backgroundservice;

import java.io.IOException;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;

import android.os.AsyncTask;

import com.google.android.gms.maps.model.LatLng;

public class Foursquare extends AsyncTask<Void, Void, String>{
	
	public LatLng userLatLng;
	public Foursquare(LatLng location){
		this.userLatLng = location;
	}

	@Override
	protected String doInBackground(Void... params) {
		HttpClient httpClient = new DefaultHttpClient();
		HttpContext localContext = new BasicHttpContext();
		String text = null;
		try {
			String exploreUrl = "https://api.foursquare.com/v2/venues/explore?ll="+userLatLng.latitude+ ","+ userLatLng.longitude+"&limit=12&venuePhotos=1&sortByDistance=1&client_id=5VBHVYNQEJXS1K0MK0YW4NTXBJCCT3VGNMOX0WVCLQZDR1FC&client_secret=HSL2BVQRIGCUSMZ51EXIP1JXEWITIAI5SPGKQ0GAKGI12RD5&v=20140605";
			HttpGet httpGet = new HttpGet(exploreUrl);
			HttpResponse response = httpClient.execute(httpGet, localContext);
			HttpEntity entity = response.getEntity();
			text = getASCIIContentFromEntity(entity);
		} catch (Exception e) {

		}
		return text;
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
}
