/* global
        ace
        hljs
        Cookies

        editing
        publish_endpoint
        save_endpoint
        save_history_endpoint
*/
$(document).ready(function () {
    $("select[name='author']").selectize();
    var md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (e) {
                    // Do nothing
                }
            }
            return ""; // use external default escaping
        }
    });

    var editor = ace.edit("editor");
    var textarea = $("textarea[name='content']");
    var output = $(".output");

    if (textarea.val() !== "") {
        editor.setValue(textarea.val());
        editor.clearSelection();
        output.html(md.render(editor.getSession().getValue()));
    }

    editor.setFontSize(16);
    editor.renderer.setShowGutter(false);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setMode("ace/mode/markdown");
    editor.getSession().on("change", function () {
        textarea.val(editor.getSession().getValue());
        output.html(md.render(editor.getSession().getValue()));
    });

    function onResize() {
        $(".raw").height($(window).height() - $(".raw").position().top);
        $(".output").height($(window).height() - $(".output").position().top - 30);
    }
    $(window).resize(onResize);
    onResize();

    if (editing) {
        $("[value='save']").click(function (e) {
            e.preventDefault();
            var form = $("form");
            var endpoint = $(this).data("history") ? save_history_endpoint : save_endpoint;
            $.post(endpoint, form.serialize(), function (data) {
                if (data.success) {
                    Messenger().success(data.success);
                    $("#id_reason")
                        .val("")
                        .input();
                } else if (data.error) {
                    Messenger().error(data.error);
                }
            });
        });

        $("[value='post']").click(function (e) {
            e.preventDefault();
            var form = $("form");
            var reason = $("#id_reason");
            if (reason.val() == "") {
                reason.val("Publishing Document");
            }
            $.post(save_history_endpoint, form.serialize(), function (data) {
                if (data.success) {
                    Messenger().success(data.success);
                    $.post(publish_endpoint, {
                        revision_id: data.rid,
                        csrfmiddlewaretoken: Cookies.get("csrftoken")
                    }, function (data) {
                        if (data.success) {
                            Messenger().success("Successfully published article :)");
                            $("#id_reason")
                                .val("")
                                .input();
                        }
                    });
                    $("#id_reason")
                        .val("")
                        .input();
                } else if (data.error) {
                    Messenger().error(data.error);
                }
            });
        });
    }

    $("#id_reason").on("input", function () {
        var icon = $("[value='save']").children("i");
        if ($(this).val() !== "") {
            $("[value='save']")
                .text(" Make Revision")
                .prepend(icon)
                .data("history", true);
        } else {
            $("[value='save']")
                .text(" Save")
                .prepend(icon)
                .data("history", false);
        }
    });
});