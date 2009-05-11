// ==========================================================================
// Project:   Yummy - mainPage
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Yummy */

// This page describes the main user interface for your application.  
Yummy.mainPage = SC.Page.design({
	
	// The main pane is made visible on screen as soon as your app is loaded.
	// Add childViews to this pane for views to display immediately on page 
	// load.
	mainPane: SC.MainPane.design({
		layout: { top: 0, left: 0, right: 0, bottom: 41 },
		childViews: 'topView leftView rightView'.w(),
		topView: SC.View.design(SC.Border, {
			layout: { top: 0, left: 0, right: 0, height: 41 },
			childViews: 'labelView'.w(),
			borderStyle: SC.BORDER_BOTTOM,
			
			labelView: SC.LabelView.design({
				layout: { centerY: 0, height: 24, left: 8, width: 200 },
				controlSize: SC.LARGE_CONTROL_SIZE,
				fontWeight: SC.BOLD_WEIGHT,
				value:	 "Yummy"
			})
		}),
		leftView: SC.ScrollView.design({
			hasHorizontalScrollbar: NO,
			layout: {top: 42, bottom: 42, left: 0, width: 200},
			backgroundColor: 'white',
			
			contentView: SC.ListView.design({
				contentBinding: 'Yummy.bookmarksController.arrangedObjects',
				selectionBinding: 'Yummy.bookmarksController.selection',
				contentValueKey: 'title',
				canReorderContent: YES
			})
		}),
		rightView: SC.View.design(SC.Border, {
			layout: {top: 42, bottom: 42, left: 200, right: 0},
			childViews: 'urlView urlLabelView titleView titleLabelView'.w(),
			borderStyle: SC.BORDER_LEFT,
			urlView: SC.TextFieldView.design({
				layout: { top: 0, left: 50, width: 300, height: 20},
				valueBinding: 'Yummy.selectedBookmarkController.url'
			}),
			urlLabelView: SC.LabelView.design({
				layout: {top: 0, left: 0, width: 50, height: 20},
				value: "URL:".loc()
			}),
			titleView: SC.TextFieldView.design({
				layout: { top: 21, left: 50, width: 300, height: 20},
				valueBinding: 'Yummy.selectedBookmarkController.title'
			}),
			titleLabelView: SC.LabelView.design({
				layout: {top: 20, left: 0, width: 50, height: 20},
				value: "Title:".loc()
			})
		}),
		bottomView: SC.View.design(SC.Border, {
			layout: {bottom: 0, left: 0, right: 0, height: 41},
			// childViews: ''.w(),
			borderStyle: SC.BORDER_TOP
		})
	})
});
