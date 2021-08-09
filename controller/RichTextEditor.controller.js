sap.ui.define(['sap/ui/core/mvc/Controller',"sap/m/MessageToast","sap/m/MessageBox","sap/ui/richtexteditor/sample/RichTextEditor/util/read"], 
function (Controller,MessageToast,MessageBox,aws,read){
	"use strict";
	return Controller.extend("sap.ui.richtexteditor.sample.RichTextEditor.controller.RichTextEditor", {
	
		onInit: function() {
			this.initRichTextEditor(false);
		},
		onSave: function () {

            MessageBox.success("Article Saved Successfully");
        },
		onCancel: function () {
			MessageBox.warning("Cancel the changes made to the Article?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				
			});
		},
		
		initRichTextEditor: function (bIsTinyMCE5) {
			var that = this,
				sHtmlValue = fetchOneByKey();
				sap.ui.require(["sap/ui/richtexteditor/RichTextEditor"],
				
				function (RTE) {
					that.oRichTextEditor = new RTE("myRTE", {
						
						width: "100%",
						height: "600px",
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						value: sHtmlValue,
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(that.oRichTextEditor);
			});
		}

	});
});