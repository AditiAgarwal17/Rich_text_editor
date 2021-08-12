sap.ui.define(['sap/ui/core/mvc/Controller',"sap/m/MessageToast","sap/m/MessageBox","sap/ui/richtexteditor/sample/RichTextEditor/util/read"], 
function (Controller,MessageToast,MessageBox,aws,read){
	"use strict";
	return Controller.extend("sap.ui.richtexteditor.sample.RichTextEditor.controller.RichTextEditor", {
	
		onInit: function() {
			this.initRichTextEditor(false);
		},
		
		onCancel: function () {
			MessageBox.warning("Cancel the changes made to the Article?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				
			});
		},
		initRichTextEditor: function (bIsTinyMCE5) {
			var that = this,
				sHtmlValue = "";

			fetchOneByKey().then(function (data) {
				that.oRichTextEditor.mProperties.value=data.Content
			});
			
				sap.ui.require(["sap/ui/richtexteditor/RichTextEditor"],
				
				function (RTE) {
					that.oRichTextEditor = new RTE("myRTE", {

						width: "100%",
						height: "600px",
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(that.oRichTextEditor);
					
			});
			
		},
		onSave: function () {
			var that=this,
				content=that.oRichTextEditor.mProperties.value
			let modify = function () {

    
				var params = {
					TableName: "Articles",
					Key: { "UUID": "2" },
					UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue, Content= :String",
					ExpressionAttributeValues: {
						":byUser": "updateUser",
						":boolValue": true,
						":String":content
					},
					ReturnValues: "UPDATED_NEW"
			
				};
				docClient.update(params, function (err, data) {
			
					if (err) {
						console.log("users::update::error - " + JSON.stringify(err, null, 2));
					} else {
						console.log("users::update::success "+JSON.stringify(data) );
					}
				});
			}
			modify();
            MessageBox.success("Article Saved Successfully");
			
        },

	});
});