/**
 * Universal validate form v0.1
 * @author Oleg Shevelev|mantyr@gmail.com
 */

function valid_phone(phone) {
    var phone = phone.replace(/[^0-9]/g, "");
    var view = phone;
    if (phone.length >= 11) {
        view = phone.replace(/([0-9]*)([0-9]{3})([0-9]{3})([0-9]{2})([0-9]{2})$/g, '$1 ($2) $3-$4-$5');
    } else if (phone.length >= 5) {
        view = phone.replace(/([0-9]*)([0-9]{2})([0-9]{2})$/g, '$1-$2-$3');
    }
    return {view : view, phone: phone};
}

$(document).on("change", "form input", function(event){
    var value = $(this).val().trim();
    var valid = $(this).data('valid');

    if (valid == 'yes' && value == '') {
        $(this).addClass('error');

    } else if (valid == 'email' && !/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/.test(value)) {
        $(this).addClass('error');

    } else if (valid == 'phone') {
        var phone = valid_phone(value);

        if (phone.phone.length < 5) {
            $(this).addClass('error');

        } else {
            $(this).removeClass('error');
        } 5)
        $(this).val(phone.view);
    } else {
        $(this).removeClass('error');
    }
});


$(document).on("submit", "form", function(event){
    var obj = $(event.target);
    var address = obj.attr('action');
    var message = obj.find('.title');
    var field   = obj.find('.fields');
    var fields = {};

    var error = false;

    obj.find('input[type=text]').each(function(){
        var name = $(this).attr('name');
        var value = $(this).val().trim();
        var valid = $(this).data('valid');

        if (valid == 'yes' && value == '') {
            $(this).addClass('error');
            error = true;

        } else if (valid == 'email' && !/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/.test(value)) {
            $(this).addClass('error');
            error = true;

        } else if (valid == 'phone') {
            var phone = valid_phone(value);

            if (phone.phone.length < 5) {
                $(this).addClass('error');
                error = true;

            } else {
                $(this).removeClass('error');
                fields[name] = phone.phone;
            }
            $(this).val(phone.view);
        } else {
            $(this).removeClass('error');
            fields[name] = value;
        }

    });

    if (error) return false;

    $.post(address, {send : fields}, function(data){
        var arr = $.parseJSON(data);
        if (arr.status == 'OK') {
            message.html(arr.message);
            field.hide();
        } else {
            alert(arr.message);
        }
    })

    return false;
});