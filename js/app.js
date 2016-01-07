///////////////////////////
/*  GLOBAL VARIABLES    */
//////////////////////////


var all_stat_ids = ['#attack_stat', '#endurance_stat', '#speed_stat',
                    '#magic_stat', '#fire_stat', '#ice_stat',
                    '#thunder_stat', '#wind_stat', '#holy_stat',
                    '#dr', '#un', '#ma', '#ro', '#pt',
                    '#be', '#sk', '#me', '#mi', '#mg'];


var selected_weapon_id = "";

//Dictionary of all weapons. key=id, value=weapon (class)
var weapons = {};






$( document ).ready(function() {

    create_weapons("http://johannbm.github.io/weapon_data/test.xml");

    $( "li > img" ).click(weapon_selected_click_handler);

});


function weapon_selected_click_handler() {
    $(this).parent().siblings().hide(0);

    var current_stats = $('.active_stats');

    //Is there already a stat window open?
    if (current_stats.length > 0) {
        //Is it the same as the one we clicked? If so, close it
        if (selected_weapon_id === $(this).parent().attr('id')) {
            current_stats.hide(300, function() {current_stats.remove()});
            $(this).parent().siblings().show(0);
            $(this).siblings().animate({fontSize: 20});
            $(this).animate({width:150}, {queue:false});
            $(this).animate({height:100},{queue:false});

        }

    }
    //No stat window open, create a new
    else {
        add_stat_template($(this));
        $(this).siblings().animate({fontSize: 40});
        $(this).animate({width:300}, {queue:false});
        $(this).animate({height:200},{queue:false});

    }

    //Save the current weapon id for future use
    selected_weapon_id = $(this).parent().attr('id');
}

/**
  * Modify and add the weapon stat template 
  * @params {li} selected_rank - element clicked
*/
function add_stat_template(selected_weapon_element) {
    var tmpl = document.getElementById('weapon_stats_template').content.cloneNode(true);

    $(selected_weapon_element).closest('.weapon_overview').append(tmpl);

    apply_weapon_all_stats($(selected_weapon_element).parent().attr('id'));

    $('#build_up > button').on("click", build_up_click_handler);

    $('.active_stats').show(500);
}

/**
  * Fired when a build up button is clicked
  * Calculate and display required stats
*/
function build_up_click_handler() {
    var from = weapons[selected_weapon_id].getStats();
    var to = weapons[$(this).attr('id')].getStats();
    var stat_difference = calc_upgrade_stats(from, to);

    //Check if this button is already clicked
    if ($(this).hasClass('active_build_up')) {
        //If so, unselect it and reset stats and remove missing_stat class
        $(this).removeClass('active_build_up');
        load_weapon_stats(weapons[selected_weapon_id]);
        $('.missing_stats').removeClass('missing_stats');
    } 
    //If a button is active, check if any other button is active
    else {
        if ($('.active_build_up').length > 0) {
            //Reset the stats
            load_weapon_stats(weapons[selected_weapon_id]);
            $('.missing_stats').removeClass('missing_stats');
            $(this).siblings('button').removeClass('active_build_up');


            //Add the new stats
            apply_missing_stats(stat_difference);
            $(this).addClass('active_build_up');
        } 
        //If no other button is selected, add the missing stats and set button active
        else {
            apply_missing_stats(stat_difference);
            $(this).addClass('active_build_up');
        }
    }
}

/**
  * Loop through every stat, for stats where stats[i] is > 0, update numerical and add class .missing_stats
  * @params {Array[int]} stats
*/
function apply_missing_stats(stats) {

    for (i = 0; i < stats.length - 1; i++) {
        var elem = $(all_stat_ids[i]);
        if (stats[i] > 0) {
            elem.addClass('missing_stats');
            var numeric = elem.children(':first-child').next();
            numeric.text(parseInt(numeric.text()) + stats[i]);
        }
    }
}


/**
  * Applies all weapon stats in order
  * 1. Actual weapon stats
  * 2. How to acquire
  * 3. Build_up options
  * @params {String} weapon_id - id of weapon to display
*/
function apply_weapon_all_stats(weapon_id) {
    var weapon = weapons[weapon_id];
    load_weapon_stats(weapon);
    load_acquisition(weapon.procured);
    load_build_up(weapon.upgrades, weapon.weapon_upgrades);
}



/**
  * Loop through all stats and update the display of each
  * @params {Weapon} weapon
*/
function load_weapon_stats(weapon) {
    
    var all_weapon_stats = weapon.getStats();

    for (var i=0; i < all_stat_ids.length; i++) {
        var temp_selector = all_stat_ids[i] + ' > td';
        update_stat(all_weapon_stats[i], $(temp_selector)[1], $(temp_selector + ' > div'));
    }
}

/** 
  * Update both numerical and display bar value
  * @params {int} value - numerical value to set
  * @params {td} numeric - element representing numerical score
  * @params {div} bar - element representing the progressbar
*/
function update_stat(value, numeric, bar) {

    var res = (value >= 99) ? 150 : (value*150)*0.01;

    //update progressbar
    bar.animate({width: res});

    //update numeric field
    numeric.innerText = value;
}

/**
  * Adds a list element for every descripion in info
  * @param {Array[String]} info - array of descriptions on how to acquire weapon
*/
function load_acquisition(info) {

    for (value in info) {
        $('#acquisition').append("<li>" + info[value] + "</li>");
    }
}

/**
  * Create buttons for each possible build ups
  * @params {Array[String]} info - an array of each build up's id
  * @params {Array[String]} upgrade_weapons - an array of weapons(class)
*/
function load_build_up(info, upgrade_weapons) {
    //For every possible upgrade, add a html element that finally should look like this
    //<button id="small_sword"> <img src="img/toan/small_sword.png"> Small Sword</button>
    for (value in info) {
        $('#build_up').append("<button id=\"" + info[value] +"\"> <img src=\"img/toan/" + info[value] + ".png\">"  + upgrade_weapons[value].title + "</button>");
    }

}

/**
 * Accepts two lists that each contain all numerical stats of a weapon
 * @param {Array[int]} from
 * @param {Array[int]} to
 * @return The difference between to and from (to - from)
*/
function calc_upgrade_stats(from, to) {
    var res = [];
    for (var i = 0; i < from.length; i++) {
        res.push(to[i] - from[i]);
    };

    return res;
}

//Goes through every xml element named 'weapon', and adds it as a id-weapon pair.
/**
 * Loop through every element in file_name with tag 'weapon'
 * Create weapon and add to the weapon dictionary
 * @param {String} file_name
 */
function create_weapons(file_name) {
    $.ajax({
        type: "GET",
        url: file_name,
        dataType: "xml",
        success: function(xml) {
            $(xml).find('weapon').each(function() {
                weapons[$(this).attr('name')] = new Weapon($(this));
            });

            //After all weapons are created, loop through and add all possible upgrades
            for (weapon in weapons) {
                weapons[weapon].add_upgrade_weapons(weapons);
            }
        }
    });
    
}


