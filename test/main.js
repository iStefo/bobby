@require('main.js')	// circular references are no problem, main.js is allready marked as loaded!
@require("libs/jquery.js")
@require("libs/ember.js")
// This is some javascript file acting as a project "index"
Ember.jQuery = $;