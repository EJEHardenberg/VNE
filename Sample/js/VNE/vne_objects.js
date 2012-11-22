/*	Visual Novel Engine v0.75
	Copyright 2012 Brian Crucitti - bcrucitti@gmail.com
	
	This file is part of Visual Novel Engine.

    Visual Novel Engine is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    Visual Novel Engine is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Visual Novel Engine.  If not, see <http://www.gnu.org/licenses/>.
*/

var vne_defineObjects = function(){//Setup
//\\Models
//-Display-----------------------------------------------------------------
	//Backbone Model for the background
	Background = Backbone.Model.extend({
		el: $("#background"),
		image: 'Title.png',
		alter: function(image){
			this.image = image;
			this.el.html('<img src="background/'+image+'" height="600px" width="800px"/>');
		},
		initialize: function(){
			this.el.html('<img src="background/Title.png" height="600px" width="800px"/>');
		}
	});
	//Backbone Model for characters
	Character = Backbone.Model.extend({
		el: $("character"),
		image: 'Nobody.png',
		isHidden: false,
		
		alter: function(image){
			this.el.html('<img src="characters/'+image+'" height="330px" width="220px"/>');
			if(this.isHidden){
				this.show();
			}
		},
		hide: function(){
			this.el.hide();
			this.isHidden = true;
		},
		show: function(){
			this.el.show();
			this.isHidden = false;
		}
	});
//-Display End--------------------------------------------------------------
//-UI-----------------------------------------------------------------------
	//Backbone Model for the options menu
	Options = Backbone.Model.extend({
		el: $("#optionsBox"),
		choices: [],
		initialize: function(){
			this.hide();
		},
		hide: function(){
			this.el.hide();
		},
		addChoice: function(choice, effect){
			this.choices.push({'choice':choice,'effect':effect});
		},
		clearChoices: function(){
			this.hide();
			this.choices = [];
		},
		showOptions: function(){
			var out = "<ul>";
			for(var i=0;i<this.choices.length;i++){
				out += li({item: this.choices[i]['choice']});
			}
			out += "</ul>";
			this.el.html(out);
			this.el.show();
			this.selection = 0;
			this.setSelection(this.selection);
		},
		confirmSelection: function(){
			return this.choices[this.selection]['effect'];
		},
		setSelection: function(item){
			var out = "<ul>";
			for(var i=0;i<this.choices.length;i++){
				if(i==item){
					out += '<li class="white">'+this.choices[i]['choice']+'</li>';
				}else{
					out += li({item: this.choices[i]['choice']});
				}
			}
			out += "</ul>";
			this.el.html(out);
		},
		selectionDown: function(){
			if(this.selection >= this.choices.length-1){
				this.selection = this.choices.length-1;
			}else{
				this.selection++;
			}
			this.setSelection(this.selection);
		},
		selectionUp: function(){
			if(this.selection <= 0){
				this.selection = 0;
			}else{
				this.selection--;
			}
			this.setSelection(this.selection);
		}
	});
	//Backbone Model for the text bar, contains speaker box and text box
	UiBar = Backbone.Model.extend({
		el: $("#uiBar"),
		speaker: $("#speaker"),
		textBox: $("#text"),
		isHidden: false,
		
		initialize: function(){
			// this.switchHidden();
		},
		switchHidden: function(){
			if(this.isHidden){
				this.show();
			}else{
				this.hide();
			}
		},
		show: function(){
			this.el.show();
			this.isHidden = false;
		},
		hide: function(){
			this.el.hide();
			this.isHidden = true;
		},
		setText: function(msg){
			this.textBox.text(msg);
		},
		setSpeaker: function(spk){
			this.speaker.html('<span>'+spk+'</span>');
		}
	});
	//Backbone Model for the menu bar, which does nothing right now
	MenuBar = Backbone.Model.extend({
		el: $("#menuBar"),
		initialize: function(){
			this.el.hide();
		}
	});
//-UI End-------------------------------------------------------------------
//-Title--------------------------------------------------------------------
	//Backbone Model for Title Options
	TitleOption = Backbone.Model.extend({
		confirmed: function(){},
		selected: function(){},
		deselected: function(){},
		init: function(){}
	});
	//Backbone Model for Title Screen
	Title = Backbone.Model.extend({
		el: $("#title"),
		options: [],
		addOption: function(op){
			op.init();
			this.options.push(op);
		},
		init: function(){
			this.selection = 0;
			this.setSelection(this.selection);
		},
		confirmSelection: function(){
			this.options[this.selection].confirmed();
		},
		setSelection: function(item){
			for(var i=0;i<this.options.length;i++){
				if(i==item){
					this.options[i].selected();
				}else{
					this.options[i].deselected();
				}
			}
		},
		selectionDown: function(){
			if(this.selection >= this.options.length-1){
				this.selection = this.options.length-1;
			}else{
				this.selection++;
			}
			this.setSelection(this.selection);
		},
		selectionUp: function(){
			if(this.selection <= 0){
				this.selection = 0;
			}else{
				this.selection--;
			}
			this.setSelection(this.selection);
		},
		hide: function(){
			this.el.hide();
		}
	});
//-Title End----------------------------------------------------------------	
	
	HelpScreen = Backbone.Model.extend({
		el: $("#helpWindow"),
		hide: function(){
			this.el.hide();
		},
		show: function(){
			this.el.show();
		},
		initialize: function(){
			this.hide();
		}
	});
	
	//?? Backbone model for gameplay ??
	
	//Backbone model for the whole visual novel
	VisualNovel = Backbone.Model.extend({
		background: new Background,
		helpScreen: new HelpScreen,
		optionsBox: new Options,
		character_left: new Character,
		character_right: new Character({'el':'$("#character_left")'}),
		uiBar: new UiBar,
		menuBar: new MenuBar,
		title: new Title,
		// game: new Game,
		
		isDecisionPoint: false,
		isTitleScreen: true,
		isHelpScreen: false,
		
		/*Initialize function for the vn, not called immediately
			so that changes can be made to any objects in the vn.
		*/
		init: function(){
			this.uiBar.hide();
			this.character_left.el = $("#character_left");
			this.character_right.el = $("#character_right");
			this.character_left.alter("Nobody.png");
			this.character_right.alter("Nobody.png");
			this.character_left.hide();
			this.character_right.hide();
			
			//?
			this.helpScreen.el.click(function(){
				vn.helpScreen.hide();
				vn.isHelpScreen = false;
			});
			
			//initialize title screen
			this.title.init();
		},
		//Add option to title screen
		addTitleOption: function(option){
			this.title.addOption(option);
		},
		//Toggle display of UI
		switchHidden: function(){
			this.uiBar.switchHidden();
		},
		
	//Gameplay
		scriptText: ['...'],
		scriptLine: 0,
		//Retreive text using an ajax request
		retreiveText: function(file){
			var url = "retreiveText.php";
			var text = ""
			var vn = this;
			$.post(url, {'file':file}).complete(function(data){
				text = data.responseText.split("\n");
				vn.scriptText = text;
				vn.scriptLine = -1;
				vn.nextLine();
			});
		},
		//Move on to the next line of the script
		nextLine: function(){
			this.scriptLine++;
			if(this.scriptLine >= this.scriptText.length){
				console.info("End of Script");
				return;
			}
			var msg = this.scriptText[this.scriptLine];
			if(msg.charAt(0) == '['){
				this.interpretCommand(msg);
			}else if(msg.charAt(0) == '{'){
				this.interpretOptions(msg);
			}else{
				var loc = msg.search(/:/);
				if(loc != -1){
					var spkr = msg.slice(0,loc);
					msg = msg.slice(loc+1);
					msg = jQuery.trim(msg);
					this.uiBar.setSpeaker(spkr);
				}
				this.uiBar.setText(msg);
			}
		},
		//Interpret a command line from text into actions
		interpretCommand: function(msg){
			//?loop if '[' isn't closed?
			msg = msg.replace(/(^\[|\]$)/g,"");
			var cmdList = msg.split(/;/g)
			for(var i=0;i<cmdList.length;i++){
				var currCmd = cmdList[i].replace(/;/g,"");
				var cmd = currCmd.split(/:/g);
				if(cmd.length<2){
					continue;
				}
				var att = jQuery.trim(cmd[0]);
				var eff = jQuery.trim(cmd[1]);
				this.sendCommand(att, eff);
			}
		},
		//Interpret an option line from text into actions
		interpretOptions: function(msg){
			msg = jQuery.trim(msg);
			var optionLine = this.scriptLine;
			while(msg.search(/}/g) == -1){
				// console.error("} not found");
				this.scriptLine++;
				if(this.scriptLine >= this.scriptText.length){
					console.error("No closing '}' for options on line "+optionLine);
					return;
				}
				msg += this.scriptText[this.scriptLine];
				msg = jQuery.trim(msg);
			}			
			msg = msg.replace(/(^{|}$)/g,"");
			console.log(msg);
			var opList = msg.split(/,/g)
			console.log(opList);
			for(var i=0;i<opList.length;i++){
				var currOp = opList[i];
				
				var loc = currOp.search(/:/);
				var option = currOp.slice(0,loc);
				var effect = currOp.slice(loc+1);
				option = jQuery.trim(option);
				effect = jQuery.trim(effect);
				this.optionsBox.addChoice(option,effect);
			}
			this.optionsBox.showOptions();
			this.isDecisionPoint=true;
		},
		//Send a command to the correct piece of the vn
		sendCommand: function(att, arg){
			att = att.toLowerCase();
			switch(att){
			case 'background':
				this.background.alter(arg);
				this.nextLine();
				break;
			case 'character_left':
				this.character_left.alter(arg);
				this.nextLine();
				break;
			case 'character_right':
				this.character_right.alter(arg);
				this.nextLine();
				break;
			case 'load_text':
				this.retreiveText(arg);
				break;
			case 'goto':
				this.setLine(arg);
				this.nextLine();
				break;
			}
		},
		setLine: function(arg){
			if((typeof arg === "number") && Math.floor(arg) === arg){
				this.scriptLine = arg-1;
			}else{
				if(arg.charAt(0) == '+'){
					var val = parseInt(arg.slice(1),10)-1;
					console.log(val);
					this.scriptLine += val;
				}else if(arg.charAt(0) == '-'){
					var val = parseInt(arg.slice(1),10)+1;
					console.log(val);
					this.scriptLine -= val;
				}
			}
		}
		
	});
//\\End Models
};//End Setup


//Template
var list = _.template("<% _.each(items, function(name) { %> <li><%= name %></li> <% }); %>");
var li = _.template("<li><%- item %></li>");