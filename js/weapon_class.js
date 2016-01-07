function Weapon (stats) {
	this.title = $("title", stats).text();
	this.attack = $("attack", stats).text();
	this.endurance = $("endurance", stats).text();
	this.speed = $("speed", stats).text();
	this.magic = $("magic", stats).text();
	this.fire = $("fire", stats).text();
	this.ice = $("ice", stats).text();
	this.thunder = $("thunder", stats).text();
	this.wind = $("wind", stats).text();
	this.holy = $("holy", stats).text();
	this.dragon = $("dragon", stats).text();
	this.undead = $("undead", stats).text();
	this.marine = $("marine", stats).text();
	this.rock = $("rock", stats).text();
	this.plant = $("plant", stats).text();
	this.beast = $("beast", stats).text();
	this.sky = $("sky", stats).text();
	this.metal = $("metal", stats).text();
	this.mimic = $("mimic", stats).text();
	this.mage = $("mage", stats).text();
	this.slots = $("slot", stats).text();
	this.procured = this.getAllItems("procure", stats);
	this.upgrades = this.getAllItems("upgrade", stats);
	this.weapon_upgrades = [];
}

Weapon.prototype.add_upgrade_weapons = function(weapons) {
	for (w in this.upgrades) {
		this.weapon_upgrades.push(weapons[this.upgrades[w]]);
	}
}

Weapon.prototype.getAllItems = function(name, stats) {
	var res = [];
	$(name, stats).each(function () {
		res.push($(this).text());
	});

	return res;
}

Weapon.prototype.getStats = function() {
	return [this.attack, this.endurance, this.speed, this.magic,
			this.fire, this.ice, this.thunder, this.wind, this.holy,
			this.dragon, this.undead, this.marine, this.rock, this.plant,
			this.beast, this.sky, this.metal, this.mimic, this.mage];
};

Weapon.prototype.getMoreInfo = function() {
	return [this.slots, this.procured, this.upgrades];
}
