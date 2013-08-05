var htmlparser2 = require("htmlparser2"),
    Parser = htmlparser2.Parser,
    Handler = htmlparser2.DomHandler,
    CSSselect = require("../");

module.exports = {
	CSSselect: CSSselect,
	getFile: function(name){
		return module.exports.getDOM(
			require("fs").readFileSync(__dirname + "/docs/" + name).toString()
		);
	},
	getDOM: function(data){
		var h = new Handler({refParent: true, ignoreWhitespace: true}),
			p = new Parser(h);
		
		p.write(data);
		p.end();
		
		return h.dom;
	},
	getDefaultDom: function(){
		return module.exports.getDOM(
			"<elem id=foo><elem class='bar baz'><tag class='boom'> This is some simple text </tag></elem></elem>"
		);
	}
};