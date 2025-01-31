'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	load: function () {
		return L.resolveDefault(fs.read_direct('/etc/banip/banip.blocklist'), '');
	},
	handleSave: function (ev) {
		var value = ((document.querySelector('textarea').value || '').trim().toLowerCase().replace(/\r\n/g, '\n')) + '\n';
		return fs.write('/etc/banip/banip.blocklist', value)
			.then(function (rc) {
				document.querySelector('textarea').value = value;
				ui.addNotification(null, E('p', _('Blocklist modifications have been saved, restart banIP that changes take effect.')), 'info');
			}).catch(function (e) {
				ui.addNotification(null, E('p', _('Unable to save modifications: %s').format(e.message)));
			});
	},
	render: function (blocklist) {
		return E([
			E('p', {},
				_('This is the local banIP blocklist that will prevent certain MAC/IP/CIDR addresses.<br /> \
				<em><b>Please note:</b></em> add only exactly one MAC/IPv4/IPv6 address or domain name per line.')),
			E('p', {},
				E('textarea', {
					'style': 'width: 100% !important; padding: 5px; font-family: monospace',
					'spellcheck': 'false',
					'wrap': 'off',
					'rows': 25
				}, [blocklist != null ? blocklist : ''])
			)
		]);
	},
	handleSaveApply: null,
	handleReset: null
});
