"use strict"
const fs = require('fs');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const moment = require('moment');
const multer = require('multer');
const mysql = require('mysql');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const http_socket = require('http').Server(app);
const io_socket = require('socket.io')(http_socket);

app.set('view engine', 'ejs');
app.use(express.static('audio'));
app.use(express.static('images'));
app.use(express.static("views"));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false ,limit : '100mb'}));
app.use(bodyParser.json());
app.use(cookieParser('keyboard cat'));
app.use(function (req, res, next){
	var user_id = req.cookies.userId;
	var username = req.cookies.username;
	if(typeof user_id === "undefined"){
		user_id = 0;
		username = "";
	}
	next();
})

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'rAnd0m',
	cookie: { maxAge: 60000 }
}));

app.use(flash());
const arranged = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'audio/uploads/arranged');
	},
	filename: function (req, file, cb) {
		let sql = "SELECT max(id) as id FROM music_arrangement";
		connection.query(sql,
		(error,results) => {
			if(error) {
				console.log('error connecting: ' + error.stack);
				return;
			}
			console.log(results);
			let extension = file.originalname.substr(-4);

			cb(null, req.cookies.userId+"_" + (results[0].id + 1)+"_A" +extension);
			});
	}
})
const unfinished = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'audio/uploads/unfinished');
	},
	filename: function (req, file, cb) {
		let sql = "SELECT max(id) as id FROM music_unfinished";
		connection.query(sql,
		(error,results) => {
			if(error) {
				console.log('error connecting: ' + error.stack);
				return;
			}
			if (!results) {
				results[0].id = 1;
			}
			console.log(results);
			let extension = file.originalname.substr(-4);

			cb(null, req.cookies.userId +"_"+ (results[0].id+1)+"_U"+extension);
			});
	}
})
const arrange = multer({ storage: arranged });
const unfinish = multer({ storage: unfinished });
//DBへの接続
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: 3306,
	database: 'recreate',
	multipleStatements: true
	
});

connection.connect((error) => {
	if(error) {
		console.log('error connecting: ' + error.stack);
		return;
	}
	console.log('success');
});

//ログイン認証
const passport = require('passport');
app.use(cookieParser());
app.use(passport.initialize());
const LocalStrategy = require('passport-local').Strategy;
const { max } = require('moment');
const { promises } = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');
const { exit } = require('process');
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done){
		let values = [
			password,
			email
		];
		connection.query(
			'SELECT * FROM user WHERE password=? AND email=?', values,
			(error, results) => {
				if(error){
					return;
				}
				console.log(results);
				let count = results.length;
				if(count == 0){
					return done(null, false);
				}else{
					console.log(results);
					return done(null, results[0]);
				}
			}
		);
    }
    
));

app.get('/', async (req, res) => {
	let sql = "SELECT * FROM music_arrangement";
	connection.query(sql,(error,results) => {
		if(error) {
			console.log('error connecting: ' + error.stack);
			return;
		}
		console.log('success');
		res.render('index.ejs', {
			userFlg: req.cookies.userId,
			values: results,
			username:req.cookies.username,
			moment:moment
		});
	});
})
app.post('/popularArrange', (req, res) => {
	console.log(req.body.key);
	let sql = "SELECT * FROM "+req.body.key;
	connection.query(sql,(error,results) => {
		if(error) {
			console.log('error connecting: ' + error.stack);
			return;
		}
		console.log('success');
		res.send(results);
	});
})
app.post('/search', (req, res) => {
	let word = req.body.word;
	res.render('search/search.ejs', {
		userFlg: req.cookies.userId,
		username: req.cookies.username,
		word:word
	});	

})
app.get('/search/:word', (req, res) => {
	let word = req.params.word;

	let mTitle = "SELECT * FROM music_arrangement where mTitle like '%" + word + "%' OR mName like '%" + word +"%' OR mTag like '%"+word+"%';";
	let uTitle = "SELECT * FROM music_unfinished WHERE uTitle like '%" + word + "%' OR uName like '%"+word+"%' OR uTag like '%"+word+"';";
	connection.query(mTitle + uTitle, (err, results) => {
		res.send({
			arranged: results[0],
			unfinished:results[1]

		});	
	})
})
app.get('/music_arrangement/:id', (req, res) => {
	console.log(req.params.id);
	//params(id)の値と合致する編曲済み曲をとってくる
	let music = "SELECT * FROM music_arrangement WHERE id =" + req.params.id;
	connection.query(music, (err, results) => {
		if (err) {
			
		}
		let music = results[0];
		//上記の処理でとってきた曲の編曲者をとってくる
		let user = "SELECT * FROM user WHERE id = " + results[0].userId;
		connection.query(user, (err, results) => {
			if (err) {
				
			}
			let user = results[0];
			let subscriptions = {
				twitter: results[0].twitter,
				instagram: results[0].instagram,
				soundcloud: results[0].soundcloud,
				spotify: results[0].spotify,
				applemusic:results[0].applemusic
			}
			//編曲済み曲の元となる未完成曲の情報をとってくる
			let provider = "SELECT * FROM music_unfinished WHERE id = " + music.UnId;
			console.log(subscriptions);
			connection.query(provider, (err, results) => {
				if (err) {
					
				}
				res.render('music_arrangement/music_arrangement.ejs', {
					userFlg: req.cookies.userId,
					username: req.cookies.username,
					subscriptions: subscriptions,
					music: music,
					id: req.params.id,
					users: user,
					provider: results[0],
					audioPath: music.mSound + '/' +music.userId + "_" + req.params.id + "_A.mp3",
					unfinishedPath:"/music_unfinished/" + results[0].id
				})
			})
		})
	});
})
app.get('/music_unfinished/:id', (req, res) => {

	// 複数のmysqlを実行する場合、;を適切につける（じゃないと連結するさいに一つのsqlとして処理される）
	let sql1 = "SELECT * FROM music_unfinished where id = "+req.params.id+";";
	connection.query(sql1, (error, results) => {
		if (error) {
			console.log('error connecting: ' + error.stack);
			return;
		}
		let sql = "SELECT * FROM user WHERE id=" + results[0].userId;
		let music = results[0];
		let subscriptions = {
			twitter: results[0].twitter,
			instagram: results[0].instagram,
			soundcloud: results[0].soundcloud,
			spotify: results[0].spotify,
			applemusic:results[0].applemusic
		}
		connection.query(sql, (error, results) => {
			if (error) {
				console.log('error connecting: ' + error.stack);
				return;
			}
			let users = results[0];
			let ArMusic = "SELECT * FROM music_arrangement WHERE UnId = " + req.params.id + ";";
			connection.query(ArMusic, (err, results) => {
				if (err) {
					
				}
				console.log(results);
				res.render('music_unfinished/music_unfinished.ejs', {
					userFlg: req.cookies.userId,
					username: req.cookies.username,
					id: req.params.id,
					music:music,
					users: users,
					subscriptions: subscriptions,
					arrangedMusic:results,
					audioPath: music.uSound + "/" + music.userId + "_" + req.params.id + "_U.mp3",
				})
			})
	})
	});
});
app.post('/unfinished_download', (req, res) => {
	let audioPath = req.body.audioPath;
	let musicName = req.body.musicName;
	let musicId = req.body.musicId;
	let userId = req.cookies.userId;
	res.download(audioPath, musicName, function (err) {
		if (err) {
			
		} else {
			let max = "SELECT uDl FROM music_unfinished WHERE id=" + musicId + ";";
			connection.query(max, (error, results) => {
				if (error) {
					
				}
				console.log(results[0].uDl);
				let update = "UPDATE music_unfinished SET uDl = ? WHERE id=" + musicId + ";";
				connection.query(update,[results[0].uDl+1] ,(error, results) => {
					if (error) {
							
					}
					let ex = "SELECT userId,unfinishedId FROM download WHERE userid = ? AND unfinishedId = ?";
					connection.query(ex, [userId, musicId], (err, results) => {
						if (results[0] == null) {
							let insert = "INSERT INTO download(userId,unfinishedId)VALUES(?,?);";
							connection.query(insert, [userId, musicId], (error, results) => {
								if (error) {
							
								}
							})
						}	
					})
				});
			})
		}
	})
	
})
app.post('/download', (req, res) => {
	let filename = req.body.filename;
	let audioPath = "audio/"+req.body.audioPath;
	let musicName = req.body.musicName;
	let musicId = req.body.musicId;
	let dlName;
	if (filename == 'music_unfinished') {
		dlName = "uDl";
	}
	if (filename == 'music_arrangement') {
		dlName = "mDl";
	}
	res.download(audioPath, musicName, function (err) {
		if (err) {
			
		} else {
			let max = "SELECT "+dlName+" FROM "+ filename +" WHERE id=" + musicId + ";";
			console.log(max);
			connection.query(max, (error, results) => {
				if (error) {
					
				}
				let dlNum;
				if (filename == 'music_unfinished') {
					dlNum = results[0].uDl;
				}
				if (filename == 'music_arrangement') {
					dlNum = results[0].mDl;
				}
				let param = dlNum + 1;
				let update = "UPDATE "+ filename +" SET "+ dlName+" = "+ param +" WHERE id=" + musicId + ";";
				let insert = "INSERT INTO download(userId,unfinishedId)VALUES(" + req.cookies.userId + ","+ musicId+");";
				connection.query(update+insert, (error, results) => {
					if (error) {
							
					}
				});
			})
		}
	})
	
})
app.get('/mypage/:id', (req, res) => {

	let user = 'SELECT * FROM user where id =' + req.cookies.userId + ";";
	connection.query(user,(error,results) => {
		if(error) {
			console.log('error connecting: ' + error.stack);
			return;
		}
		res.render('mypage/mypage.ejs', {
			userFlg: req.cookies.userId,
			username: req.cookies.username,
			values: results,
			image: results[0].image +"/" + req.cookies.userId + ".png"
		});
	});
})
app.get('/profile/:id', (req, res)=>{

	let sql = "SELECT * FROM user WHERE id=" + req.cookies.userId + ";";
	connection.query(sql, (err,results) => {
		if (err) {
			
		}
		res.render('profile/profile.ejs', {
			userFlg: req.cookies.userId,
			username:req.cookies.username,
			profile: results[0],
			image: results[0].image + "/" + req.cookies.userId + ".png"
		})
	})
})
app.post('/profile', (req, res) => {
	if (req.body.resultImage != "") {
		const base64 = req.body.resultImage.split(',')[1];
		const decode = new Buffer.from(base64, 'base64');
		const path = "public/img/user/" + req.cookies.userId + ".png";
		fs.writeFile(path, decode, (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	let sql = "UPDATE user SET username = ?,image = ?,info = ?,site=?,twitter = ?,instagram = ?,soundcloud = ?,spotify = ?,applemusic = ? WHERE id = ?;";
	connection.query(sql, [
		req.body.username,
		"/img/user",
		req.body.info,
		req.body.sitelink,
		req.body.Twitter,
		req.body.Instagram,
		req.body.Soundcloud,
		req.body.Spotify,
		req.body.AppleMusic,
		req.cookies.userId
	], (err, results) => {
		if (err) {
			console.log(err);
		}
		// ユーザーネームに変更が加えられた場合のみ
		if (req.body.username !== req.cookies.username) {
			let arranged = "UPDATE music_arrangement SET mName = '" + req.body.username + "' WHERE userId = " + req.cookies.userId + ";";
			let unfinished = "UPDATE music_unfinished SET uName = '" + req.body.username + "' WHERE userId = " + req.cookies.userId + ";";
			console.log(arranged, unfinished);
			connection.query(arranged + unfinished, (err, results) => {
				if (err) {
					console.log(err);
				}
				console.log('WELCOME');
				res.cookie('username', req.body.username, { maxAge: 1000 * 60 * 60, httpOnly: false });
				req.flash('success', 'プロフィールを更新しました。');
				res.redirect('/');
				res.end();
			})
		} else {
			console.log('hello');
			req.flash('success', 'プロフィールを更新しました。');
			res.redirect('/');
		}
	})

})

/**
 * マイページのAPI ----------------------
 */
app.post('/navPrev', (req, res) => {
	let arranged = "SELECT * FROM music_arrangement WHERE userId = ?;";
	let unfinished = "SELECT * FROM music_unfinished WHERE userId = ?;";
	connection.query(arranged+unfinished, [req.body.userId,req.body.userId], (err,results) => {
		if (err) {
			
		}
		res.send({arranged:results[0],unfinished:results[1]});
	})
})

app.post('/navLike', async (req, res) => {
	let lAr = "SELECT ArId FROM like_ar WHERE userId = " + req.cookies.userId + ";";
	let lUn = "SELECT UnId FROM like_un WHERE userId = " + req.cookies.userId + ";";
	connection.query(lAr + lUn, async (err, results) => {
		console.log(results);
		let arranged = [];
		let unfinished = [];
		for (var i = 0; i < results[0].length; i++) {
			arranged[i] = `SELECT * FROM music_arrangement WHERE id = ` + results[0][i].ArId + `;`;
		}
		for (var j = 0; j < results[1].length; j++) {
			unfinished[j] = `SELECT * FROM music_unfinished WHERE id = ` + results[1][j].UnId + `;`;
		}
		let Ar = [];
		let Un = [];
		
		for (var j = 0; j < arranged.length; j++) {
			const query1 = () => new Promise((resolve, reject) => {
				connection.query(arranged[j], (err, results) => {
					if (err) {
						reject(err)
					}
					resolve(results[0]);
				})
			})
			Ar[j] = await query1();
		}
		for (var i = 0; i < unfinished.length; i++){
			const query2 = () => new Promise((resolve, reject) => {
				connection.query(unfinished[i], (err, results) => {
					if (err) {
						reject(err);
					}
					resolve(results[0]);
				})
			})
			Un[i] = await query2();
		}
		Promise.all([Ar, Un]).then(results => {
			res.send({ arranged: results[0], unfinished: results[1] });
		})
	})
})
app.get('/upload', (req, res) => {

		//編曲した曲をアップロードするとき、アップロードするユーザがサイト内でダウンロードした未完成曲のリストを取得したい。
		let sql = "SELECT * FROM music_unfinished as mu inner join download on mu.id = download.unfinishedId where download.userId = "+req.cookies.userId;	
		connection.query(sql,(err,results) => {
			if (err) {
				
			}
			console.log(results);
			res.render('upload/upload.ejs', {
			userFlg: req.cookies.userId,
			musics: results,
			username: req.cookies.username
			});	
		})

})
/**
 * likeをつけるAPI
 */
app.post('/like', (req, res) => {
	let music = Number(req.body.musicId);
	let Good = Number(req.body.Good);
	let filename = req.body.filename;
	let likeDB = req.body.likeDB;
	let likeColumn = req.body.likeColumn;
	let goodName = "";
	if (filename == 'music_unfinished') {
		goodName = "uGood";
	}
	if (filename == 'music_arrangement') {
		goodName = "mGood";
	}
	let select = "SELECT * FROM "+likeDB+" WHERE userId = "+req.cookies.userId+" AND "+likeColumn+" = "+music+";";
	connection.query(select, (err, results) => {
		if (results[0] != null) {
			let count = Number(Good) - 1;
			let down = "UPDATE "+filename+" SET "+goodName+" = "+count+" WHERE id = "+music+";";
			let del = "DELETE FROM "+likeDB+" WHERE userId = "+req.cookies.userId+" AND "+likeColumn+" = "+music+";";
			connection.query(down+del, (err) => {
				res.send("white");
			})
		} else {
			console.log('helo');
			let count = Number(Good) + 1;

			let up = "UPDATE "+filename+" SET "+ goodName +" = "+count+" WHERE id = "+music+";";
			let like = "INSERT INTO "+ likeDB +"(userId,"+ likeColumn+")VALUES("+ req.cookies.userId +","+music+");";
			connection.query(up + like,(err) => {

				if (err) {
					console.log('error');
				}
				res.send("red");
			})

		}
	});
})
app.post('/arrangeResult', arrange.single('file'), (req, res) => {
	var today = new Date();
	var year = today.getFullYear();
	var Month = today.getMonth();
	var Day = today.getDate();

	console.log(req.file);
	console.log(req.body);
	let sql = "SELECT uName FROM music_unfinished WHERE id = " + req.body.provider;
	connection.query(sql, (err, results) => {
		if (err) {
			
		}
		let sql = "INSERT INTO music_arrangement (mTitle,mName,mTag,mInfo,mProvider,mCreated,mTime,mDl,mGood,mCom,mRep,mSound,UnId,userId)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		connection.query(sql, [
			req.body.title,
			req.cookies.username,
			req.body.tag,
			req.body.info,
			results[0].uName,
			year + "-" + Month + "-" + Day,
			req.body.time,
			0,
			0,
			req.body.com,
			req.body.rep,
			'uploads/arranged',
			req.body.provider,
			req.cookies.userId
		],(error,results) => {
			if(error) {
				console.log('error connecting: ' + error.stack);
				return;
			}
			console.log('success');
			res.render('index.ejs', {
				userFlg: req.cookies.userId,
				values: results,
				username:req.cookies.username,
				moment:moment
			});
		});
	})
})
app.post('/unfinishedResult', unfinish.single('file'),(req, res) => {
	var today = new Date();
	var year = today.getFullYear();
	var Month = today.getMonth();
	var Day = today.getDate();

	console.log(req.body);
	console.log(req.file);
	console.log(req.body.title);
	let sql = "INSERT INTO music_unfinished (uTitle,uName,uTag,uInfo,uProvider,uCreated,uTime,uGood,uDl,uSound,userId)VALUES(?,?,?,?,?,?,?,?,?,?,?)";
	connection.query(sql, [
		req.body.title,
		req.cookies.username,
		req.body.tag,
		req.body.info,
		req.cookies.username,
		year + "-" + Month + "-" + Day,
		req.body.time,
		0,
		0,
		'uploads/unfinished',
		req.cookies.userId

	],(error,results) => {
		if(error) {
			console.log('error connecting: ' + error.stack);
			return;
			}
		// unfinish.single('file');
		console.log('success');
		res.render('index.ejs', {
			userFlg: req.cookies.userId,
			values: results,
			username:req.cookies.username,
			moment:moment
		});
	});
	
})
app.get('/signUp', (req, res) => {
	res.render('signup/signUp.ejs',{ userFlg: 0 });
})
app.get('/signIn', (req, res) => {
	res.render('signin/signIn.ejs', { userFlg: 0 });
})
app.get('/signout', (req, res) => {
	res.clearCookie('userId');
	res.clearCookie('username');
	req.flash('success', 'ログアウトしました。');
	res.redirect('/');
})

app.post('/signIn',	
	passport.authenticate('local',
		{
			session: false,
			failureRedirect: '/signIn',
		}
	),
	(req, res) => {
		var user = JSON.parse(JSON.stringify(req.user));
		console.log(user.id);
		res.cookie('userId', user.id, {maxAge:1000 * 60 * 60, httpOnly:false});
		res.cookie('username', user.username, { maxAge: 1000 * 60 * 60, httpOnly: false });
		req.flash('success','こんにちわ '+user.username+' さん')
		res.redirect('/');
});
app.post('/signUp', (req, res) => {
	let senddata = {
		username: req.body.username,
		email: req.body.email,
		password:req.body.pass
	}
	res.cookie('username', req.body.username, {maxAge:1000 * 60 * 60, httpOnly:false});

	connection.query("INSERT INTO user(username,email,password)VALUES(?,?,?);",[senddata.username,senddata.email,senddata.password],(error,results) => {
		if(error) {
			console.log('error connecting: ' + error.stack);
			return;
		}
		let sql = "SELECT max(id) as id FROM user";

		connection.query(sql, (error, results) => {
			if(error) {
				console.log('error connecting: ' + error.stack);
				return;
			}
			res.cookie('userId', results[0].id, {maxAge:1000 * 60 * 60, httpOnly:false});
			let userId = results[0].id;
			let sql = "SELECT * FROM music_arrangement";
			connection.query(sql, (error, results) => {
				if(error) {
					console.log('error connecting: ' + error.stack);
					return;
				}
				res.render('index.ejs', {
					userFlg: userId,
					username:req.body.username,
					values: results,
					moment:moment
				});
			});
		});
	});
})
http_socket.listen(9000);
