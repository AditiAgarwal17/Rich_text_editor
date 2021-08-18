sap.ui.define(['sap/ui/core/mvc/Controller',"sap/ui/model/resource/ResourceModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/richtexteditor/sample/RichTextEditor/util/read","sap/ui/model/json/JSONModel"], 
function (Controller,ResourceModel,MessageToast,MessageBox,aws,read,JSONModel){
	"use strict";
	var oResourceBundle;
	var sHtmlValue = "";
	var tableName;
	var uuid;
	var articleIndex;
	var categories=[];
	var cats=[];
	var categoryVal;
	var content;
	var updateVals=false;
	return Controller.extend("sap.ui.richtexteditor.sample.RichTextEditor.controller.RichTextEditor", {
	
		onInit: function() {
			oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
			content=oResourceBundle.getText('ContentVal');
			categoryVal=oResourceBundle.getText('CategoryVal');
			this.initRichTextEditor(false);
			
			tableName=oResourceBundle.getText('TableName');
			articleIndex=oResourceBundle.getText('ArticleIndex');
			var that = this,
				sHtmlValue = "";
				var title="";

				var oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
				var tableName=oResourceBundle.getText('TableName');
				var articleIndex=oResourceBundle.getText('ArticleIndex');
				var arr=fetchOneByKey(tableName).then(function(result) {
				console.log(result)
				cats=result; 
				for (var key in cats){
					categories.push({Category: cats[key]['Category'] });
				  }
				  var sheetNames = {myList : categories};
				  console.log(sheetNames);
				  var sheets = new sap.ui.model.json.JSONModel(sheetNames);
					var comboBox = that.getView().byId("selectCategory");
					var oItemTemplate = new sap.ui.core.Item({

						text : '{Category}'
					});

					comboBox.setModel(sheets);
					comboBox.bindItems("/myList", oItemTemplate);
			 })
				
				var category =  JSON.parse(JSON.stringify(categories));
				console.log(categories);
				var mappedNames = categories.map(function(tableName){ return { Name : tableName}; });
				console.log(mappedNames);
				var jsondata = {
					items: categories
				 };
			   var jsonModel = new sap.ui.model.json.JSONModel();
			   jsonModel.setData(cats);
			   var oComboBox = that.byId("selectCategory");
			   oComboBox.setModel(jsonModel);
		},
		onSelect: function(bIsTinyMCE5){
		
			categoryVal=this.getView().byId('selectCategory').getSelectedItem().getText();
			   console.log(categoryVal);
			   this.getView().byId("title").setValue(categoryVal);
			   for (var key in cats){
				console.log(categoryVal);
				if(cats[key]['Category']===categoryVal){
					content=cats[key]['Content'];
					uuid=cats[key]['UUID'];
					break;
				}
			  }
			  console.log(content);
			  sHtmlValue=content;
			  this.oRichTextEditor.mProperties.value=content;
			  this.getView().byId("idVerticalLayout").addContent(this.oRichTextEditor);
			  this.update();
		},
		update:function(){
			updateVals=true;
		},
		initRichTextEditor: function (bIsTinyMCE5) {
			
			var that = this;
			that.getView().byId("title").setValue(categoryVal);
				
				console.log(sHtmlValue);
	
			   
				sap.ui.require(["sap/ui/richtexteditor/RichTextEditor"],
				
				function (RTE) {
					that.oRichTextEditor = new RTE("myRTE", {

						width: "100%",
						height: "600px",
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						value:content,
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(that.oRichTextEditor);
					
					console.log(updateVals);
					
			});
			
			
		},
		
		onSave: function () {
			oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
			tableName=oResourceBundle.getText('TableName');
				var titleVal=this.getView().byId("title").getValue();
				var that=this,
				content=that.oRichTextEditor.mProperties.value;
				
			let modify = function () {
				
				
				var params = {
					TableName: tableName,
					Key: { "UUID":uuid },
					UpdateExpression: "set Content= :S, Category= :String",
					ExpressionAttributeValues: {
						
						":S":content,
						":String":titleVal
					},
					ReturnValues: "UPDATED_NEW"
			
				};
				docClient.update(params, function (err, data) {
			
					if (err) {
						console.log("users::update::error - " + JSON.stringify(err, null, 2));
						MessageBox.error("Please try again.");
					} else {
						console.log("users::update::success "+JSON.stringify(data) );
						MessageBox.success("Article Saved Successfully");
					}
				});
			}
			modify();
            
			
        },
		onCancel: function () {
			var that=this;
			MessageBox.warning("Cancel the changes made to the Article?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (sAction) {
					if(sAction===MessageBox.Action.YES){
						console.log(sAction);
						fetchOneByKey().then(function (data) {
							that.oRichTextEditor.mProperties.value=data.Content;
							
						});
					}
				}
			});
		},

	});
});