package com.example.fragment;



import com.example.activty.CaptureActivity;
import com.example.activty.Exit;
import com.example.activty.MainActivty;
import com.example.eshopmobile.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

/**
 * 首页 设置 fragment
 * @author dewyze
 *
 */
public class SettingFragment extends BaseFragment {

	private static final String TAG = "SettingFragment";
	private Activity mActivity;
	private TextView mTitleTv;
	// 推荐给微信好友
	private RelativeLayout mRecommondToWeixinLayout;
	// 反馈意见
	private RelativeLayout mFeedbackLayout;
	// 关于我们
	private RelativeLayout mAboutUsLayout;
	// 应用推荐
	private RelativeLayout mAppRecommendLayout;
	// 清除缓存
	private RelativeLayout mClearCacheLayout;
	//退出
	private RelativeLayout signOutLayout;
	

	public static SettingFragment newInstance() {
		SettingFragment settingFragment = new SettingFragment();

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
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View view = inflater.inflate(R.layout.fragment_setting, container,
				false);
		return view; 
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
		mTitleTv = (TextView) view.findViewById(R.id.title_tv);
		mTitleTv.setText(R.string.setting);
		
		/**
		 *  退出按钮点击
		 */
		Button exitBtn = (Button) view.findViewById(R.id.exit_settings);
		exitBtn.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View arg0) {
				Intent intent = new Intent(getActivity(), Exit.class);
				getActivity().startActivity(intent);			
			}
		});
		
		
		TextView textView = (TextView) view.findViewById(R.id.shaoshao);
		textView.setClickable(true);
		textView.setFocusable(true);
		textView.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View arg0) {
				Intent intent = new Intent(getActivity(), CaptureActivity.class);
				getActivity().startActivity(intent);					
			}
		});
//		
//		mRecommondToWeixinLayout = (RelativeLayout) view.findViewById(R.id.recommond_to_weixin_layout);
//		mFeedbackLayout = (RelativeLayout) view.findViewById(R.id.feedback_layout);
//		mAboutUsLayout = (RelativeLayout) view.findViewById(R.id.about_us_layout);
//		mAppRecommendLayout = (RelativeLayout) view.findViewById(R.id.app_recommend_layout);
//		mClearCacheLayout = (RelativeLayout) view.findViewById(R.id.clear_cache_layout);
//		signOutLayout =(RelativeLayout) view.findViewById(R.id.sign_out_layout);
	}
	
	private void initEvents() {
//		mRecommondToWeixinLayout.setOnClickListener(this);
//		mFeedbackLayout.setOnClickListener(this);
//		mAboutUsLayout.setOnClickListener(this);
//		mAppRecommendLayout.setOnClickListener(this);
//		mClearCacheLayout.setOnClickListener(this);
//		signOutLayout.setOnClickListener(this);
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
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
		System.out.println("退出");

		
		switch (v.getId()) {
//		case R.id.recommond_to_weixin_layout:
//			// 推荐给微信好友
//			break;
//		case R.id.feedback_layout:
//			// 反馈意见
//			//CommonUtils.launchActivity(mActivity, FeedBackActivity.class);
//			break;
//		case R.id.about_us_layout:
//			// 关于我们
//			break;
//		case R.id.app_recommend_layout:
//			// 应用推荐
//			break;
//		case R.id.clear_cache_layout:
//			// 清除缓存
//			break;
		case R.id.exit_settings:
//			//退出
	
//	
//			Intent intent = new Intent();
//        	intent.setClass(getActivity(),Exit.class);
//        	startActivity(intent);
//			break;
//
		default:
			break;
		}
	}


}
