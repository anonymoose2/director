$(document).ready(function() {
    $(".search-box").on("input", function(){
        var val = $(this).val().toLowerCase();

        var notags = [];
        var nomatches = val.match(/notag:\w+/g);
        if (nomatches) {
            $.each(nomatches, function(k, v) {
                notags.push(v.substring(6).toLowerCase());
            });
        }
        val = $.trim(val.replace(/\s*notag:\w+/g, ""));

        var tags = [];
        var matches = val.match(/tag:\w+/g);
        if (matches) {
            $.each(matches, function(k, v) {
                tags.push(v.substring(4).toLowerCase());
            });
        }
        val = $.trim(val.replace(/\s*tag:\w+/g, ""));
        var search_objects = $(".search-box").data("search");
        $(search_objects).each(function(k, v) {
            var name = $(this).find(".name").text();
            var desc = $(this).find(".desc").text();
            var type = $(this).find(".type").text();
            var show = true;
            var site_tags = null;
            if (tags.length || notags.length) {
                site_tags = [];
                $(this).find(".tag").each(function(k, v) {
                    site_tags.push($(this).text().replace(/\W/g, "").toLowerCase());
                });
            }
            if (tags.length) {
                show = false;
                $.each(tags, function(k, v) {
                    $.each(site_tags, function(k2, v2) {
                        if (v2.indexOf(v) != -1) {
                            show = true;
                            return false;
                        }
                    });
                });
            }
            if (notags.length) {
                $.each(notags, function(k, v) {
                    $.each(site_tags, function(k2, v2) {
                        if (v2.indexOf(v) != -1) {
                            show = false;
                            return false;
                        }
                    });
                });
            }
            if (show && (desc.toLowerCase().includes(val) || name.toLowerCase().includes(val) || type.toLowerCase().includes(val))) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
        var sites_shown = $(search_objects + ":visible").length;
        var sites_total = $(search_objects).length;
        if (sites_shown < sites_total) {
            $("#filtered").html("(<b>" + sites_shown + "</b> shown out of <b>" + sites_total + "</b>)");
        }
        else {
            $("#filtered").html("");
        }
    });
});