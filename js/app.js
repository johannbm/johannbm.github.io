var all_stat_ids = ['#attack_stat', '#endurance_stat', '#speed_stat',
                    '#magic_stat', '#fire_stat', '#ice_stat',
                    '#thunder_stat', '#wind_stat', '#holy_stat',
                    '#dr', '#un', '#ma', '#ro', '#pt',
                    '#be', '#sk', '#me', '#mi', '#mg'];

var selected_weapon = "";

var weapons = {};

function create_weapons() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8000/weapon_data/test.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('weapon').each(function() {
                weapons[$(this).attr('name')] = new Weapon($(this));
            });
            for (weapon in weapons) {
                weapons[weapon].add_upgrade_weapons(weapons);
            }
        }
    });
    
}


$( document ).ready(function() {
    create_weapons();


    $( "li" ).click(function( event ) {

        $(this).siblings().hide(0);

        var current_stats = $('.active_stats');

        //Is there already a stat window open?
        if (current_stats.length > 0) {
            //Is it the same as the one we clicked? If so, close it
            if (selected_weapon === $(this).attr('id')) {
                current_stats.hide(300, function() {current_stats.remove()});
                $(this).siblings().show(0);
                $('p', this).animate({fontSize: 20});
                $('img', this).animate({width:150}, {queue:false});
                $('img', this).animate({height:100},{queue:false});

            }
    
        }
        //No stat window open, create a new
        else {
            add_stat_template($(this));
            $('p', this).animate({fontSize: 40});
            $('img', this).animate({width:300}, {queue:false});
            $('img', this).animate({height:200},{queue:false});

        }

        //Save the current weapon id for future use
        selected_weapon = $(this).attr('id');
    });
});

function add_stat_template(selected_rank) {
    var tmpl = document.getElementById('weapon_stats_template').content.cloneNode(true);

    $(selected_rank).closest('.weapon_overview').append(tmpl);
    apply_weapon_all_stats($(selected_rank).attr('id'));

    $('#build_up > button').on("click", function() {

        var from = weapons[selected_weapon].getStats();
        var to = weapons[$(this).attr('id')].getStats();
        var stat_difference = calc_upgrade_stats(from, to);

        //Check if this button is already clicked
        if ($(this).hasClass('active_build_up')) {
            //If so, unselect it and reset stats and remove missing_stat class
            $(this).removeClass('active_build_up');
            load_weapon_stats(weapons[selected_weapon]);
            $('.missing_stats').removeClass('missing_stats');
        } 
        //If a button is active, check if any other button is active
        else {
            if ($('.active_build_up').length > 0) {
                //Reset the stats
                load_weapon_stats(weapons[selected_weapon]);
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
    });

    $('.active_stats').show(500);
}

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


function apply_weapon_all_stats(weapon_id) {
    var weapon = weapons[weapon_id];
    load_weapon_stats(weapon);
    console.log("applying");
    load_acquisition(weapon.procured);
    console.log(weapon);
    load_build_up(weapon.upgrades, weapon.weapon_upgrades);
}

function load_weapon_stats(weapon) {
    
    var all_weapon_stats = weapon.getStats();

    for (var i=0; i < all_stat_ids.length; i++) {
        var temp_selector = all_stat_ids[i] + ' > td';
        update_stat(all_weapon_stats[i], $(temp_selector)[1], $(temp_selector + ' > div'));
    }
}

function update_stat(value, numeric, bar) {
    //update progressbar
    //bar.width((value*150)*0.01);
    var res = (value*150)*0.01;
    bar.animate({width: res});

    //update numeric field
    numeric.innerText = value;
}

function load_acquisition(info) {
    //Delete old if they exist
    $('#acquisition > li').remove();

    for (value in info) {
        $('#acquisition').append("<li>" + info[value] + "</li>");
    }
}

function load_build_up(info, upgrade_weapons) {
    $('#build_up > li').remove();
    console.log(info);
    console.log(upgrade_weapons);

    for (value in info) {
        $('#build_up').append("<button id=\"" + info[value] +"\"> <img src=\"img/toan/" + info[value] + ".png\"> "  + upgrade_weapons[value].title + "</button>");
    }

}

function calc_upgrade_stats(from, to) {
    var res = [];
    for (var i = 0; i < from.length; i++) {
        res.push(to[i] - from[i]);
    };

    return res;
}

function load_gemstones() {

}


