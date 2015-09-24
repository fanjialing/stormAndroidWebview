package com.example.adapter;


import com.example.eshopmobile.R;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckedTextView;


/**
 *  消息
 * @author Administrator
 *
 */
public class MsgListAdapter extends BaseAdapter {

	private Context mContext;
	private String[] mCategories;
	private LayoutInflater mInflater;
	// default selected item
	private int mSelectedPos = 0;

	public MsgListAdapter(Context context, String[] categories) {
		super();
		this.mContext = context;
		this.mCategories = categories;
		this.mInflater = LayoutInflater.from(context);
	}

	@Override
	public int getCount() {
		return (null == mCategories) ? 0 : mCategories.length;
	}

	@Override
	public String getItem(int position) {
		return (null == mCategories) ? null : mCategories[position];
	}

	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {

		if (null == mContext) {
			return null;
		}

		if (null == mCategories || mCategories.length == 0
				|| mCategories.length <= position) {
			return null;
		}

		final ViewHolder viewHolder;
		if (null == convertView) {
			viewHolder = new ViewHolder();
			convertView = mInflater.inflate(R.layout.msg_list_item, parent,
					false);

			viewHolder.cateCheckedTextView = (CheckedTextView) convertView
					.findViewById(R.id.cate_tv);

			convertView.setTag(viewHolder);
		} else {
			viewHolder = (ViewHolder) convertView.getTag();
		}

		viewHolder.cateCheckedTextView.setText(mCategories[position]);

		if (mSelectedPos == position) {
			viewHolder.cateCheckedTextView
					.setTextColor(Color.rgb(247, 88, 123));
		} else {
			viewHolder.cateCheckedTextView.setTextColor(Color
					.rgb(19, 12, 14));
		}

		return convertView;
	}

	class ViewHolder {
		CheckedTextView cateCheckedTextView;
	}

	public void setSelectedPos(int position) {
		this.mSelectedPos = position;
		notifyDataSetChanged();
	}

	
}
