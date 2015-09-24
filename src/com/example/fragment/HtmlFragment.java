package com.example.fragment;



import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.cordova.Config;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;


import com.example.eshopmobile.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
 * 首页 设置 fragment
 * @author dewyze
 *
 */
@SuppressLint("SetJavaScriptEnabled")
public class HtmlFragment extends BaseFragment implements OnClickListener,CordovaInterface {

	private static final String TAG = "HtmlFragment";
	private Activity mActivity;
	private TextView mTitleTv;
    // Plugin to call when activity result is received
    protected CordovaPlugin activityResultCallback = null;
    protected boolean activityResultKeepRunning;
 
    // Keep app running when pause is received. (default = true)
    // If true, then the JavaScript and native code continue to run in the background
    // when another application (activity) is started.
    protected boolean keepRunning = true;

    //Instance of the actual Cordova WebView
    private  CordovaWebView aemView;

    
    private final ExecutorService threadPool =Executors.newCachedThreadPool();  

	public static HtmlFragment newInstance() {
		HtmlFragment settingFragment = new HtmlFragment();

		return settingFragment;
	}

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		this.mActivity = activity;
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
	
	}

	@Override
    /**
     * Initialize the {@link CordovaWebView} and load its start URL.
     *
     * The fragment inflator needs to be cloned first to use an instance of {@link CordovaContext} instead.  This
     * alternate context object implements the {@link CordovaInterface} as well and acts as a proxy between the activity
     * and fragment for the {@link CordovaWebView}.  The actual {@link CordovaWebView} is defined in the home_view_frag.xml layout
     * and has an id of <b>aemWebView</b>.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {

        LayoutInflater localInflater = inflater.cloneInContext(new CordovaContext(getActivity(), this));
        View rootView = localInflater.inflate(R.layout.fragment_html, container, false);
        aemView = (CordovaWebView) rootView.findViewById(R.id.rl_title);
//      aemView.loadUrl("http://192.168.0.11:8080");
//        aemView.setWebViewClient(new WebViewClient() {
//        	public boolean shouldOverrideUrlLoading(WebView view, String url) {
//        	          view.loadUrl(url);
//        	          return true;  
//        	           }}); 
        Config.init(getActivity());
        Config.addWhiteListEntry("http://*", true);
//      Config.addWhiteListEntry("http://192.168.0.11:8080", true);
//        aemView.loadUrl("file:///android_asset/md/e/view/viewer.html");
        aemView.getSettings().setJavaScriptEnabled(true); 
      aemView.loadUrl("file:///android_asset/www/index.html");
  
//        aemView.loadUrl("http://www.baidu.com");
        return rootView;
    }

	@Override
	public void onViewCreated(View view, Bundle savedInstanceState) {
		super.onViewCreated(view, savedInstanceState);
		initViews(view);
		initEvents();
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);
	}

	private void initViews(View view) {
//		mTitleTv = (TextView) view.findViewById(R.id.title_tv);
//		mTitleTv.setText(R.string.setting);
		
		
	}
	
	private void initEvents() {

	}


	@Override
	public void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
	}

	@Override
	public String getFragmentName() {
		return TAG;
	}

	@Override
	public void onClick(View v) {

	}

    //
    // Cordova
    //

    /**
     * Called when a message is sent to plugin.
     *
     * @param id
     *            The message id
     * @param data
     *            The message data
     * @return Object or null
     */
    public Object onMessage(String id, Object data) {
        return null;
    }

    public void onDestroy() {
        super.onDestroy();
        if (aemView.pluginManager != null) {
            aemView.pluginManager.onDestroy();
        }
    }

    // Cordova Interface Events
    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {
        this.activityResultCallback = plugin;
    }

    /**
     * Launch an activity for which you would like a result when it finished. When this activity exits,
     * your onActivityResult() method is called.
     *
     * @param command           The command object
     * @param intent            The intent to start
     * @param requestCode       The request code that is passed to callback to identify the activity
     */
    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
        this.activityResultCallback = command;
        this.activityResultKeepRunning = this.keepRunning;

        // If multitasking turned on, then disable it for activities that return results
        if (command != null) {
            this.keepRunning = false;
        }

        // Start activity
        super.startActivityForResult(intent, requestCode);

    }

    @Override
    /**
     * Called when an activity you launched exits, giving you the requestCode you started it with,
     * the resultCode it returned, and any additional data from it.
     *
     * @param requestCode       The request code originally supplied to startActivityForResult(),
     *                          allowing you to identify who this result came from.
     * @param resultCode        The integer result code returned by the child activity through its setResult().
     * @param data              An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        CordovaPlugin callback = this.activityResultCallback;
        if (callback != null) {
            callback.onActivityResult(requestCode, resultCode, intent);
        }
    }

    /**
     * A {@link ContextWrapper} that also implements {@link CordovaInterface} and acts as a proxy between the base
     * activity context and the fragment that contains a {@link CordovaWebView}.
     *
     */
    private class CordovaContext extends ContextWrapper implements CordovaInterface
    {
        CordovaInterface cordova;

        public CordovaContext(Context base, CordovaInterface cordova) {
            super(base);
            this.cordova = cordova;
        }
        public void startActivityForResult(CordovaPlugin command,
                                           Intent intent, int requestCode) {
            cordova.startActivityForResult(command, intent, requestCode);
        }
        public void setActivityResultCallback(CordovaPlugin plugin) {
            cordova.setActivityResultCallback(plugin);
        }
        public Activity getActivity() {
            return cordova.getActivity();
        }
        public Object onMessage(String id, Object data) {
            return cordova.onMessage(id, data);
        }
        public ExecutorService getThreadPool() {
            return cordova.getThreadPool();
        }

    }



	  



}
