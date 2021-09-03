sap.ui.define(['sap/ui/core/mvc/Controller',"sap/ui/model/resource/ResourceModel","sap/m/MessageToast","sap/m/MessageBox","sap/ui/richtexteditor/sample/RichTextEditor/util/read","sap/ui/model/json/JSONModel"], 
function (Controller,ResourceModel,MessageToast,MessageBox,aws,read,JSONModel){
	"use strict";
	var oResourceBundle;
	var tableName;
	var uuid;
	var categories=[];//contains the name of all the categories.
	var cats=[];
	var categoryVal;
	var content;
	var recovery;
	var choice=1;
	var max_uuid=0;
	return Controller.extend("sap.ui.richtexteditor.sample.RichTextEditor.controller.RichTextEditor", {
	
		onInit:function() {
			oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
			content=oResourceBundle.getText('ContentVal');
			categoryVal=oResourceBundle.getText('CategoryVal');
			this.initRichTextEditor(false);		
			tableName=oResourceBundle.getText('TableName');
			var that = this;
				var oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
				var tableName=oResourceBundle.getText('TableName');
				fetchOneByKey(tableName).then(function(result) {
				cats=result; 
				for (var key in cats){
					categories.push({Category: cats[key]['Category'] });
					if(max_uuid<cats[key]['UUID']){
						max_uuid=parseInt(cats[key]['UUID']);
					}
				  }
				 
				  var sheetNames = {myList : categories};
				  var sheets = new sap.ui.model.json.JSONModel(sheetNames);
					var comboBox = that.getView().byId("selectCategory");
					var oItemTemplate = new sap.ui.core.Item({
						text : '{Category}'
					});

					comboBox.setModel(sheets);
					comboBox.bindItems("/myList", oItemTemplate);
			 })
			   var jsonModel = new sap.ui.model.json.JSONModel();
			   jsonModel.setData(cats);
			   var oComboBox = that.byId("selectCategory");
			   oComboBox.setModel(jsonModel);
		},//when a category is chosen.
		onSelect: function(bIsTinyMCE5){
			for (var key in cats){
				if(cats[key]['Category']===categoryVal){
					uuid=cats[key]['UUID'];
					break;
				}
			  }
			recovery=this.oRichTextEditor.mProperties.value;
			var updateExpression= "set Recovery= :S";
					var expressionAttributeValues= {
						
						":S":recovery,
					
					};
			this.save(updateExpression,expressionAttributeValues);
			var del=this.getView().byId('delete').setEnabled(true);
			var autosaveBtn=this.getView().byId('autosave').setEnabled(true);
			categoryVal=this.getView().byId('selectCategory').getSelectedItem().getText();
			   this.getView().byId("title").setValue(categoryVal);
			   for (var key in cats){
				if(cats[key]['Category']===categoryVal){
					content=cats[key]['Content'];
					uuid=cats[key]['UUID'];
					break;
				}
			  }
			  
			  this.oRichTextEditor.mProperties.value=content;
			  this.getView().byId("idVerticalLayout").addContent(this.oRichTextEditor);
			 
		},//to autosave the content in recovery
		autosave:function(bIsTinyMCE5){
			for (var key in cats){
				if(cats[key]['Category']===categoryVal){
					recovery=cats[key]['Recovery'];
					uuid=cats[key]['UUID'];
					break;
				}
			  }
			  this.oRichTextEditor.mProperties.value=recovery;
			  this.getView().byId("idVerticalLayout").addContent(this.oRichTextEditor);
		},//to build the Rich Text Editor
		initRichTextEditor: function (bIsTinyMCE5) {		
			var that = this;
			that.getView().byId("title").setValue(categoryVal);
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
			});
		},//to save the data to the database
		save:function(updateExpression,expressionAttributeValues){
			oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
			tableName=oResourceBundle.getText('TableName');
			  recovery=this.oRichTextEditor.mProperties.value;
			  let modify = function (flag) {		
				var params = {
					TableName: tableName,
					Key: { "UUID":uuid },
					UpdateExpression: updateExpression,
					ExpressionAttributeValues: expressionAttributeValues,
					ReturnValues: "UPDATED_NEW"
			
				};
				docClient.update(params, function (err, data) {
					if (err) {
						console.log("users::update::error - " + JSON.stringify(err, null, 2));
						//MessageBox.error("Please try again.");
					} else {
						console.log("users::update::success "+JSON.stringify(data) );
						//MessageBox.success("Article Saved Successfully");
					}
				});
			}
			modify();	
		},
		//when Save Button is clicked.
		onSave: function () {
			var titleVal=this.getView().byId("title").getValue();
			content=this.oRichTextEditor.mProperties.value;	
			if(choice==1){
			var updateExpression= "set Content= :S, Category= :String";
					var expressionAttributeValues= {
						
						":S":content,
						":String":titleVal
					};
			this.save(updateExpression,expressionAttributeValues);
			
				MessageBox.success("Article Saved Successfully");
			}
			if(choice==2){
				var oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
				var tableName=oResourceBundle.getText('TableName');
				console.log(choice);
				let newBlog = function () {

					var input = {
						"UUID": uuid, "Category":titleVal,"Content":content
					};
					var params = {
						TableName: tableName,
						Item:  input
					};
					docClient.put(params, function (err, data) {
				
						if (err) {
							console.log("users::save::error - " + JSON.stringify(err, null, 2));   
							MessageBox.error("Article Creation Unsuccessful");  
						} else {
							console.log("users::save::success" );        
							MessageBox.success("Article Created Successfully");            
						}
					});
				}
				
				newBlog();
			}
        },//to create a new document
		create:function(bIsTinyMCE5){
			max_uuid=max_uuid+1;
			uuid=(max_uuid).toString();
			console.log(uuid)
			this.oRichTextEditor.mProperties.value="";
			  this.getView().byId("idVerticalLayout").addContent(this.oRichTextEditor);
			  this.getView().byId("title").setValue("");
				choice=2;

		},//to export as PDF
		pdf:function(){
				var pdf = new jsPDF('p', 'pt',  'letter');
				pdf.canvas.height = 72 * 15;
				pdf.canvas.width = 72 * 13;
				var margins = {
					top: 80,
					bottom: 60,
					left: 40,
					right: 40,
					width: 522
				};
				var options = {
					pagesplit: true
			   };
				
				pdf.fromHTML(content,  margins.left// x coord
					, margins.top // y coord
					, {
						'width': margins.width // max width of content on PDF
						
					},options);
					

				pdf.save(categoryVal+'.pdf');
		},//Deleting an article

		delete:function(){
			oResourceBundle=this.getView().getModel('i18n').getResourceBundle();
			tableName=oResourceBundle.getText('TableName');
			let remove = function () {

				var params = {
					TableName: tableName,
					Key: {
						"UUID": uuid
					}
				};
				docClient.delete(params, function (err, data) {
			
					if (err) {
						MessageBox.error("Please select an article.");
					} else {
						MessageBox.success("Article Deleted Successfully");
					}
				});
			}
			
			remove();
		},//sending via mail
		sendMail:function() {
			var addresses = "";//between the speech mark goes the receptient. Seperate addresses with a ;
			var body = content.substring(0,1000)+"%0D%0A %0D%0A To read more...";//write the message text between the speech marks or put a variable in the place of the speech marks
			var subject = categoryVal;//between the speech marks goes the subject of the message
			var href = "mailto:" + addresses + "?"
					+ "subject=" + subject + "&"
					+ "body=" + body;
			var wndMail;
			wndMail = window.open(href, "_blank", "scrollbars=yes,resizable=yes,width=10,height=10");
			
		},
		//to cancel the edits made.
		onCancel: function () {
			MessageBox.warning("Cancel the changes made to the Article?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (sAction) {
					if(sAction===MessageBox.Action.YES){
						console.log(sAction);
						
					}
				}
			});
		},

	});
});