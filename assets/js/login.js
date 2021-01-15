$(function () {
    // 1.给登录和注册链接添加点击事件
    $("#link_reg").on('click', function () {
        $(".reg-box").show()
        $(".login-box").hide()
    })
    $("#link_login").on('click', function () {
        $(".reg-box").hide()
        $(".login-box").show()
    })
    // 2.自定义验证规则
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd:function(value) {
            var pwd = $(".reg-box input[name=password]").val()
            if(value !== pwd) {
                return "俩次密码输入不一致";
            }
        }
    })
    // 3.注册功能
    var layer = layui.layer;
    $("#form_reg").on('submit',function(e){
        // 阻止表单的默认提交
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method:"POST",
            url:"/api/reguser",
            data:{
                username: $(".reg-box input[name=username]").val(),
                password: $(".reg-box input[name=password]").val()
            },
            success:function(res){
                if(res.status !==0 ){
                    return layer.msg(res.message);
                }
                layer.msg("注册成功，请登录！");
                // 手动切换到登录表单
                $("#link_login").click();
                // 重置form表单
                $("#form_reg")[0].reset();
            }
        })
    })
    // 4.登录功能
    $('#form_login').on('submit',function(e){
        // 阻止表单的默认提交
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method:"POST",
            url:"/api/login",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0 ){
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，登陆成功！");
                // 保持token
                localStorage.setItem("token",res.token);
                // 跳转的主页面
                location.href = "/index.html"
                
            }
        })
    })
})