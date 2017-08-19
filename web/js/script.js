var editor, form,
    modes = [{
        name: 'C-like',
        mode: 'c_cpp'
    }, {
        name: 'CSS',
        mode: 'css'
    }, {
        name: 'CoffeeScript',
        mode: 'coffee'
    }, {
        name: 'Diff',
        mode: 'diff'
    }, {
        name: 'HTML',
        mode: 'html'
    }, {
        name: 'XML',
        mode: 'xml'
    }, {
        name: 'Java',
        mode: 'java'
    }, {
        name: 'JavaScript',
        mode: 'javascript'
    }, {
        name: 'Markdown',
        mode: 'markdown'
    }, {
        name: 'ObjectiveC',
        mode: 'objectivec'
    }, {
        name: 'PHP',
        mode: 'php'
    }, {
        name: 'Perl',
        mode: 'perl'
    }, {
        name: 'Python',
        mode: 'python'
    }, {
        name: 'Ruby',
        mode: 'ruby'
    }, {
        name: 'SQL',
        mode: 'sql'
    }, {
        name: 'Shell',
        mode: 'sh'
    }];
$(function () {
    $('.snippet').each(function () {
        var html = $("<textarea/>").html($(this).html()).val();
        editor = ace.edit($(this).get(0));
        editor.setValue(html);
        editor.clearSelection();
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/" + $(this).attr('data-mode'));
        if($(this).attr('data-readOnly')) {
            editor.setReadOnly(true);
            editor.getSession().setUseWorker(false);
        }
    });
    $('#addCode').on('click', function (e) {
        e.preventDefault();
        if (!this.state) {
            var wrap = document.createElement('div'), mode;
            $(wrap).attr({
                id: 'codeWrapper',
                class: 'content-item form-group'
            });
            $(wrap).append(
                '<form id="codeForm">' +
                '<label for="selectLanguage">Select language</label>' +
                HTMLGen.generateOptions(modes, {id: 'selectLanguage', class: 'form-control'}) +
                '<div class="content-item">' +
                '<div id="editor">' +
                '</div>' +
                '</div>' +
                '<div class="checkbox">' +
                '<label><input id="private" type="checkbox" value="">' +
                'Make private  ' +
                '<span class="glyphicon glyphicon-lock" aria-hidden="true"></span></label>' +
                '</div>' +
                '<button type="submit" class="btn btn-primary">Sumbit code</button> ' +
                '</form>'
            );
            $(this).parent().append(wrap);
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/chrome");
            editor.getSession().setMode("ace/mode/c_cpp");
            $('#selectLanguage').on('change', function () {
                mode = $(this).find(':selected').attr('data-mode');
                editor.getSession().setMode("ace/mode/" + mode);
            });
            form = $('#codeForm');
            form.on('submit', function (e) {
                e.preventDefault();
                if($(this).find('#errors')) {
                    $(this).find('#errors').remove();
                }
                $.ajax({
                    type: 'POST',
                    url: '/ajax/add-snippet',
                    dataType: 'json',
                    data: {
                        snippet: editor.getValue(),
                        private: $(this).find('#private').prop('checked'),
                        type: $(this).find('#selectLanguage').find(':selected').attr('data-mode')
                    },
                    success: function (res) {
                        if (res.error) {
                            form.append('<div class="error-summary" style="margin-top:10px;" id="errors"></div>');
                            $.each(res.error, function (index, item) {
                                console.log(item);
                                $('#errors').append(item);
                            });
                        }
                    },
                    error: function (res) {
                    }
                });

            });
            this.state = true;
        } else {
            this.state = false;
            $('#codeWrapper').remove();
        }
    });
});

HTMLGen = {
    generateOptions: function (array, attributes) {
        if (typeof array !== 'object') throw new Error('Expected array, got ' + typeof array);
        var res = '', attr = '';
        array.forEach(function (item) {
            res += '<option data-mode="' + item.mode + '">' + item.name + '</option>';
        });
        $.each(attributes, function (index, item) {
            attr += ' ' + index + '="' + item + '"';
        });
        return '<select' + attr + '>' + res + '</select>';
    }
};