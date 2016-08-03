/**
* 水球图 wataerbubble
* @author fiona23 (fiona_fanmy@163.com)
*/

(function($) {
    $.fn.waterbubble = function(options) {
            var config = $.extend({},{
                radius: 80,
                lineWidth: 5,
                data: 0,
                compareData:0.3,
                waterColor: '#abb4f7',
                innerWaterColor: '#f7b1ab',
                textColor: 'rgba(0, 128, 0, 0.8)',
                warningTextColor:'rgba(255, 0, 0, 0.8)',
                font: '',
                wave: true,
                txt: undefined,
                animation: true,
                isgap:false,
                isSmallBubble:true,
                smallBubbleColor:'rgba(255,255,255,0.6)',
                smallRadius:20,
                textWidth: ''
            }, options);
            //获得拥有canvas标签dom对象
            var canvas = this[0];
            config.lineWidth = config.lineWidth ? config.lineWidth : config.radius/24;

            var waterbubble = new Waterbubble(canvas, config);

            return this;
        }
        
        //构造函数
        function Waterbubble (canvas, config) {
            //刷新绘制
            this.refresh(canvas, config);
        }

        Waterbubble.prototype = {
            //刷新绘制函数
            refresh: function (canvas, config) {
                //在给定的矩形内清除指定的像素
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                this._init(canvas, config)
            },

            _init: function (canvas, config){
                var radius = config.radius;
                var lineWidth = config.lineWidth;
                //如果配置了水球半径 和弧线宽度 重新设置canvas宽度
                canvas.width = radius*2 + lineWidth;
                canvas.height = radius*2 + lineWidth;

                this._buildShape(canvas, config);
            },
            //构建内部水球图
            _buildShape: function (canvas, config) {

                var ctx = canvas.getContext('2d');
                //弧线和水球的间距
                var gap = config.lineWidth*2;
                //raidus of water
                //是否保留空隙
                if(config.isgap){
                    var r = config.radius - gap;
                }else{
                    var r = config.radius
                }
                
                var data = config.data;
                var lineWidth = config.lineWidth

                var waterColor = config.waterColor;
                var innerWaterColor = config.innerWaterColor;
                var textColor = config.textColor;
                var font = config.font;

                var wave = config.wave

                // //the center of circle绘制大圆
                var x = config.radius + lineWidth/2;
                var y = config.radius + lineWidth/2;

                ctx.beginPath();
                //绘制大圆
                ctx.arc(x, y, config.radius, 0, Math.PI*2);
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = waterColor;
                ctx.stroke();
                //
                //if config animation true
                if (config.animation) {
                    this._animate(ctx, r, data, lineWidth, innerWaterColor, x, y, wave)
                } else {
                    this._fillWater(ctx, r, data, lineWidth, innerWaterColor, x, y, wave);
                }
                

                this._drawText(ctx, textColor, font, config.radius, data, x, y, config.txt,config);

                return;
            },

            _fillWater: function (ctx, r, data, lineWidth, innerWaterColor, x, y, wave) {
                ctx.beginPath();

                ctx.globalCompositeOperation = 'destination-over';

                //start co-ordinates
                var sy = r*2*(1 - data) + (y - r);
                var sx = x - Math.sqrt((r)*(r) - (y - sy)*(y - sy));
                //middle co-ordinates
                var mx = x;
                var my = sy;
                //end co-ordinates
                var ex = 2*mx - sx;
                var ey = sy;

                var extent; //extent

                if (data > 0.9 || data < 0.1 || !wave) {
                    extent = sy
                } else{
                    extent = sy - (mx -sx)/4
                }

                ctx.beginPath();
                //绘制一条二次贝塞尔曲线
                ctx.moveTo(sx, sy)
                ctx.quadraticCurveTo((sx + mx)/2, extent, mx, my);
                ctx.quadraticCurveTo((mx + ex)/2, 2*sy - extent, ex, ey);

                var startAngle = -Math.asin((x - sy)/r)
                var endAngle = Math.PI - startAngle;
                //绘制波浪
                ctx.arc(x, y, r, startAngle, endAngle, false)

                ctx.fillStyle = innerWaterColor;
                ctx.fill();

                
            },
           
            _drawText: function (ctx, textColor, font, radius, data, x, y, txt,config) {
                ctx.globalCompositeOperation = 'source-over';

                var size = font ? font.replace( /\D+/g, '') : 0.4*radius;
                ctx.font = font ? font : 'bold ' + size + 'px Microsoft Yahei';

                txt = data*100 + '%';

                var sy = y + size/2;
                config.textWidth = ctx.measureText(txt).width/2;

                var sx = x - Math.floor(config.textWidth);
                if (data > config.compareData) {
                    textColor = config.warningTextColor;
                } 
                ctx.fillStyle = textColor;
                ctx.fillText(txt, sx, sy);

                if(config.isSmallBubble){
                    var smallR = config.textWidth+10;
                    this._drawSmallBubble(ctx,x,y,smallR,config);
                }

            },
             _drawSmallBubble: function(ctx,x,y,smallR,config){
                    ctx.beginPath();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.arc(x, y, smallR, 0, Math.PI*2);
                    ctx.fillStyle = config.smallBubbleColor;
                    ctx.fill();
               },

            _animate: function (ctx, r, data, lineWidth, innerWaterColor, x, y, wave) {
                var datanow = {
                    value: 0
                };
                var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (func) {
                    setTimeout(func, 16);
                };
                var self = this;
                var update = function () {
                    if (datanow.value < data - 0.01) {
                        datanow.value += (data - datanow.value)/15
                        self._runing = true;
                    } else {
                        self._runing = false;
                    }
                }
                var step = function () {
                    self._fillWater(ctx, r, datanow.value, lineWidth, innerWaterColor, x, y, wave);
                    update();
                    if (self._runing) {
                        requestAnimationFrame(step);
                    }
                }
                step(ctx, r, datanow, lineWidth, innerWaterColor, x, y, wave)
            }
        }
}(jQuery));