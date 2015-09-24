package com.example.activty;

import com.example.adapter.MainTabWidget;
import com.example.adapter.MainTabWidget.OnTabSelectedListener;
import com.example.eshopmobile.R;
import com.example.fragment.HtmlFragment;
import com.example.fragment.JingleFragment;
import com.example.fragment.MsgFragment;
import com.example.fragment.SettingFragment;
import com.example.fragment.TheContactFragment;
import com.example.util.ConstantValues;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.view.WindowManager.LayoutParams;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.Toast;


/**
 *  主界面
 * @author Administrator
 *
 */
public class MainActivty extends FragmentActivity implements OnTabSelectedListener {
	public static MainActivty instance = null;
	private static final String TAG = "AlfmMain";
	private MainTabWidget mTabWidget;
	private int mIndex = ConstantValues.MAIN_BOTTOM_MSG;
	private FragmentManager mFragmentManager;
	private MsgFragment msgFragment;
	private TheContactFragment theContactFragment;
	private SettingFragment settingFragment;
	private HtmlFragment htmlFragment;
	private JingleFragment jingleFragment;
	private LinearLayout mClose;
    private LinearLayout mCloseBtn;
    private View layout;	
    private LayoutInflater inflater;
    
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
	    //启动activity时不自动弹出软键盘
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN); 
        instance = this;
		init();
		initEvents();
	}

	private void init() {
		mFragmentManager = getSupportFragmentManager();
		mTabWidget = (MainTabWidget) findViewById(R.id.tab_widget);
	}

	private void initEvents() {
		mTabWidget.setOnTabSelectedListener(this);
	}

	@Override
	protected void onResume() {
		super.onResume();
		onTabSelected(mIndex);
		mTabWidget.setTabsDisplay(this, mIndex);
		mTabWidget.setIndicateDisplay(this, 3, true);
	}

	

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		// 自己记录fragment的位置,防止activity被系统回收时，fragment错乱的问题
		// super.onSaveInstanceState(outState);
		outState.putInt("index", mIndex);
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		// super.onRestoreInstanceState(savedInstanceState);
		mIndex = savedInstanceState.getInt("index");
	}

	@Override
	public void onTabSelected(int index) {
		FragmentTransaction transaction = mFragmentManager.beginTransaction();
		hideFragments(transaction);
		System.out.println("index::::"+index);
		
		switch (index) {
		case 0:	
			if (null == htmlFragment) {
				htmlFragment = new HtmlFragment();
				transaction.add(R.id.center_layout, htmlFragment);
			} else {
				transaction.show(htmlFragment);
			}
			break;
		case 1:	
			if (null == theContactFragment) {
				theContactFragment = new TheContactFragment();
				transaction.add(R.id.center_layout, theContactFragment);
			} else {
				transaction.show(theContactFragment);
			}
			break;
		case 2:
			if(null == jingleFragment){
				jingleFragment = new JingleFragment();
				transaction.add(R.id.center_layout,jingleFragment);
			}else{
				transaction.show(jingleFragment);
			}
			break;	
		case 3:
			if (null == settingFragment) {
				settingFragment = new SettingFragment();
				transaction.add(R.id.center_layout, settingFragment);
			} else {
				transaction.show(settingFragment);
			}
			break;	
			default:
			break;
			
		}
		
		mIndex = index;
		transaction.commitAllowingStateLoss();
	}
	
	
	private void hideFragments(FragmentTransaction transaction) {
		if (null != htmlFragment) {
			transaction.hide(htmlFragment);
		}
		if (null != theContactFragment) {
			transaction.hide(theContactFragment);
		}
		
		if(null != jingleFragment){
			transaction.hide(jingleFragment);
		}
		
		if(null != settingFragment){
			transaction.hide(settingFragment);

		}
		
	}
	
	
	private boolean menu_display = false;	
	
	// 第二种方法（再按一次退出程序）
	private long exitTime = 0;
	private PopupWindow menuWindow;
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK
				&& event.getAction() == KeyEvent.ACTION_DOWN) {
			if ((System.currentTimeMillis() - exitTime) > 2000) {
				Toast.makeText(getApplicationContext(), "再按一次退出程序",
						Toast.LENGTH_SHORT).show();
				exitTime = System.currentTimeMillis();
			} else {
				finish();
				System.exit(0);
			}
			return true;
		}
		
	if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {  //获取 back键
    		
        	if(menu_display){         //如果 Menu已经打开 ，先关闭Menu
        		menuWindow.dismiss();
        		menu_display = false;
        		}
        	else {
        		Intent intent = new Intent();
            	intent.setClass(MainActivty.this,Exit.class);
            	startActivity(intent);
        	}
    	}
    	
    	else if(keyCode == KeyEvent.KEYCODE_MENU){   //获取 Menu键			
			if(!menu_display){
				//获取LayoutInflater实例
				inflater = (LayoutInflater)this.getSystemService(LAYOUT_INFLATER_SERVICE);
				//这里的main布局是在inflate中加入的哦，以前都是直接this.setContentView()的吧？呵呵
				//该方法返回的是一个View的对象，是布局中的根
				layout = inflater.inflate(R.layout.main_menu, null);
				
				//下面我们要考虑了，我怎样将我的layout加入到PopupWindow中呢？？？很简单
				menuWindow = new PopupWindow(layout,LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT); //后两个参数是width和height
				//menuWindow.showAsDropDown(layout); //设置弹出效果
				//menuWindow.showAsDropDown(null, 0, layout.getHeight());
				menuWindow.showAtLocation(this.findViewById(R.id.tab_widget), Gravity.BOTTOM|Gravity.CENTER_HORIZONTAL, 0, 0); //设置layout在PopupWindow中显示的位置
				//如何获取我们main中的控件呢？也很简单
				mClose = (LinearLayout)layout.findViewById(R.id.menu_close);
				mCloseBtn = (LinearLayout)layout.findViewById(R.id.menu_close_btn);
				
				
				//下面对每一个Layout进行单击事件的注册吧。。。
				//比如单击某个MenuItem的时候，他的背景色改变
				//事先准备好一些背景图片或者颜色
				mCloseBtn.setOnClickListener (new View.OnClickListener() {					
					@Override
					public void onClick(View arg0) {						
						//Toast.makeText(Main.this, "退出", Toast.LENGTH_LONG).show();
						Intent intent = new Intent();
			        	intent.setClass(MainActivty.this,Exit.class);
			        	startActivity(intent);
			        	menuWindow.dismiss(); //响应点击事件之后关闭Menu
					}
				});				
				menu_display = true;				
			}else{
				//如果当前已经为显示状态，则隐藏起来
				menuWindow.dismiss();
				menu_display = false;
				}
			
			return false;
		}
		
		return super.onKeyDown(keyCode, event);
	}
	

}
