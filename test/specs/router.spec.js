define(['plugins/router'], function(router) {
	describe('plugins/router', function() {
		describe('parseQueryString', function() {
			it('returns null when the queryString parameter is an empty string', function() {
				var res = router.parseQueryString('');
				expect(res).toBeNull();
			});

			it('returns null when the queryString parameter is null', function() {
				var res = router.parseQueryString(null);
				expect(null).toBeNull();
			});

			it('returns object when queryString = "a=1"', function() {
				var res = router.parseQueryString('a=1'),
				    exp = { a: '1' };
				expect(res).toEqual(exp);
			});

			it('returns object when queryString = "a=1&b=2"', function() {
				var res = router.parseQueryString('a=1&b=2'),
				    exp = { a: '1', b: '2' };
				expect(res).toEqual(exp);
			});

			it('returns object when queryString = "a=1&b=2&b=3"', function() {
				var res = router.parseQueryString('a=1&b=2&b=3'),
				    exp = { a: '1', b: ['2', '3'] };
				expect(res).toEqual(exp);
			});
		});
	});
});
