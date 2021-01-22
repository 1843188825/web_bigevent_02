$(function () {
    // 1.初始化分类
    var form = layui.form; // 导入form
    var layer = layui.layer; // 导入layer
    initCate(); // 调用函数
    // 封装
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // 判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //  赋值，渲染 form
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render();
            }
        })
    }
    // 2.初始化富文本编辑器
    initEditor();

    //  3  文章封面
    // 3.1 初始化图片裁剪器
    var $image = $('#image')
    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })

    // 5.设置图片
    $("#coverFile").on('change', function (e) {
        // 获取到文件的列表数据
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布';
    $("#btnSave2").on('click', function () {
        state = '草稿';
    })

    // 7.添加文章
    $("#form-pub").on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 创建 FormData 对象 收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送ajax请求，要在toBlob（）函数里面
                publishArticle(fd)
            })

    })
    // 8.封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData类型数目ajax提交，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("发布文章成功！")
                // 跳转
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1000)
            }
        })
    }
})