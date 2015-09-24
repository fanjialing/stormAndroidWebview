package plugins;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

public class Toast extends CordovaPlugin {
	CallbackContext callbackContext;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		
		this.callbackContext = callbackContext;
		if (action.equals("longToast")) {
			String message = args.getString(0);
			showToastLong(message);
			return true;
		} else if (action.equals("shortToast")) {
			showToastShort(args.getString(0));
			return true;
		}
		return false;
	}

	private void showToastLong(String message) {
//		Context c = this.cordova.getActivity();
//		android.widget.Toast.makeText(c, message,
//				android.widget.Toast.LENGTH_LONG).show();
	}

	private void showToastShort(String message) {
		System.out.println(message);
		PluginResult mPlugin = new PluginResult(PluginResult.Status.ERROR,  "hello");  
        mPlugin.setKeepCallback(true);  
        callbackContext.sendPluginResult(mPlugin);  
//		
//		android.widget.Toast.makeText(this.cordova.getActivity(), message,
//				android.widget.Toast.LENGTH_SHORT).show();
	}  

	private void logger(String message) {
		Log.d("PLUG", message);
	}

}