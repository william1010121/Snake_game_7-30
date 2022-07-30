var init_varible = {
    background_color: "white", 
    block_size: 20,
    Snake_speed: 15, // grid/s
    Snake_body_color: "black",
    Snake_head_color: "blue",
    Apple_color: "pink",
    Canva_width: 500, 
    Canva_height: 500,
    TextSize: 30,
    TextColor: "Black"
};
var Canva;
var Apple;
var Snake




class _snake{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x:this.x, y:this.y}];
        this.speedx = 0;
        this.speedy = 1;
    }

    move() {
        var newReact;
        const head = this.tail[this.tail.length-1];
        if( this.speedx == 1) {
            newReact = {
                x: head.x + this.size, 
                y: head.y 
            }
        }
        else if( this.speedx == -1) {
            newReact = {
                x: head.x - this.size, 
                y: head.y 
            }
        }
        else if( this.speedy == 1) {
            newReact = {
                x: head.x, 
                y: head.y + this.size
            }
        }
        else if( this.speedy == -1) {
            newReact = {
                x: head.x,  
                y: head.y - this.size 
            }
        }

        if( newReact.x + this.size > Canva.width ) 
            newReact.x = 0
        if( newReact.y + this.size > Canva.height ) 
            newReact.y = 0
        
        if( newReact.x < 0)
            newReact.x = (Math.floor((Canva.width-1)/this.size))*this.size;
        if( newReact.y < 0)
            newReact.y = (Math.floor((Canva.height-1)/this.size))*this.size;

        
        this.tail.push( newReact ) ;
    }

    delete_top() {
        this.tail.shift();
    }
}

class _apple {
    constructor(size) {
        this.x = Math.floor( Math.random() * ((Canva.width/size)-1));
        this.y = Math.floor( Math.random() * ((Canva.height/size)-1));
        this.size = size;
        this.istouched = false;
    }

    update() {
        if( this.istouched ) {
            this.x = Math.floor( Math.random() * Canva.width / this.size);
            this.y = Math.floor( Math.random() * Canva.height / this.size);
            this.istouched = false;
        }
    }

    get_position() {
        return {x:this.x*this.size, y:this.y*this.size};
    }

}

class Canva_tool {
    constructor(cv, ctx, background_color) {
        this.ctx = ctx;
        this.cv = cv;
        this.background_color = background_color;
        this.CleanScreen();
        this.width = cv.width;
        this.height = cv.height;
    }

    CreateRect(pos, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect( pos.x, pos.y, size, size);
        //console.log( size );
    }

    CleanScreen( ) {
        this.ctx.fillStyle = this.background_color;
        this.ctx.fillRect( 0, 0, this.cv.width, this.cv.height);

    }


    DrawText( Text, pos, style=`${init_varible['TextSize']}px Arial`, align="right"){
        this.ctx.font = style;
        this.ctx.fillStyle = init_varible['TextColor'];
        this.ctx.textAlign = align;
        this.ctx.fillText( Text, pos.x, pos.y);
    }
}


window.onload = function(){
    var cv = document.getElementById('canvas');
    cv.width = init_varible['Canva_width'];
    cv.height = init_varible['Canva_height'];
    if( cv.getContext ) {
        var ctx = cv.getContext('2d');
        Canva = new Canva_tool(cv, ctx, init_varible['background_color']);
        console.log("canva init ok");
    }
    else {
        console.log( "canva error");
    }

    Snake = new _snake(0, 0, init_varible['block_size']);
    Apple = new _apple(init_varible['block_size']);

    Game_loop();

    Add_key_listener();
}


function Game_loop() {
    setInterval(
        game_process,
        1000/init_varible['Snake_speed']
    );
};


function game_process() {
    Canva.CleanScreen();
    //console.log( Snake.tail );
    //console.log( Snake.size );
    //console.log(Snake);
        
    for( let i = 0; i < Snake.tail.length-1; i++) {
        Canva.CreateRect(
            Snake.tail[i],
            Snake.size-2, 
            init_varible['Snake_body_color']
        );
    }
    Canva.CreateRect(
        Snake.tail[Snake.tail.length-1],
        Snake.size-2, 
        init_varible['Snake_head_color']
    );


    Snake.move();
    if( Snake.tail[Snake.tail.length-1].x == Apple.get_position().x && Snake.tail[Snake.tail.length-1].y == Apple.get_position().y )
        Apple.istouched = true, console.log("get");

    //console.log( Apple.get_position());
    //console.log(Snake.tail[Snake.tail.length-1]);
    

    if( Apple.istouched == false)
        Snake.delete_top();


    Apple.update();
    Canva.CreateRect( 
        Apple.get_position(),
        Apple.size, 
        init_varible['Apple_color']
    );


    for( let i = 0; i < Snake.tail.length-1; i++) {
        for(let j = i+1; j <Snake.tail.length-1; j++)
            if( 
                Snake.tail[i].x == Snake.tail[j].x &&
                Snake.tail[i].y == Snake.tail[j].y
            )
            {
                Snake = new _snake(0, 0, init_varible['block_size']);
            }
    }

    Canva.DrawText( `Score: ${Snake.tail.length}`, {x:Canva.width, y: init_varible['TextSize']});

}


window.addEventListener('keydown', (event)=> {
     /*
        Left    arrow 37
        Up      arrow 38
        Right   arrow 39
        Down    arrow 40

        A             65 
        W             87
        D             68
        S             83 
     */
     setTimeout(() => {
        if( 
            (event.keyCode == 37 || event.keyCode == 65) &&
            Snake.speedx != 1
        ) Snake.speedx = -1, Snake.speedy = 0;

        else if( 
            (event.keyCode == 38 || event.keyCode == 87) &&
            Snake.speedy != 1
        ) Snake.speedx = 0, Snake.speedy = -1;
        else if( 
            (event.keyCode == 39 || event.keyCode == 68) &&
            Snake.speedx != -1
        ) Snake.speedx = 1, Snake.speedy = 0;
        else if( 
            (event.keyCode == 40 || event.keyCode == 83) &&
            Snake.speedy != -1
        ) Snake.speedx = 0, Snake.speedy = 1;

     }, 1);
});

function Add_key_listener() {
    var Wkey = document.getElementById("Wkey");
    var Akey = document.getElementById("Akey");
    var Skey = document.getElementById("Skey");
    var Dkey = document.getElementById("Dkey");

    Wkey.addEventListener('click', ()=> {
        setTimeout( ()=>{
            if( Snake.speedy != 1 )  Snake.speedx = 0, Snake.speedy = -1;
        }, 1);
    });
    Akey.addEventListener('click', ()=> {
        setTimeout( ()=>{
            if( Snake.speedx != 1 )  Snake.speedx = -1, Snake.speedy = 0;
        }, 1)
    });
    Skey.addEventListener('click', ()=> {
        setTimeout( ()=>{
            if( Snake.speedy != -1 )  Snake.speedx = 0, Snake.speedy = 1;
        }, 1)
    });
    Dkey.addEventListener('click', ()=> {
        setTimeout( ()=>{
            if( Snake.speedx != -1 )  Snake.speedx = 1, Snake.speedy = 0;
        }, 1)
    });
}