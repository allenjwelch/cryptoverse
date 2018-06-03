const db = require("../models");
const request = require("request");

// API call to get specific coin information to the front
  module.exports = function(app) {
    app.get("/api/ticker/:id", function(req, res) {
      let cryptoId = req.params.id
      let cryptoUpper = cryptoId.toUpperCase();
      let specificCoinUrl = "";
      let coinObject ={}; // empty object that api will fill and send back to front end
      
      let coinIndex = listSymbols.symbol.indexOf(cryptoUpper) // need to pass the id of the coin we want to search for into this variable. this is the number and not 3 letter code

      let chosenCoin = listSymbols.id[coinIndex];
      specificCoinUrl = `https://api.coinmarketcap.com/v2/ticker/${chosenCoin}/`;

      request(specificCoinUrl, function(error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
          let cap = JSON.parse(body).data.quotes.USD.market_cap;
          coinObject = {
            name: JSON.parse(body).data.name,
            symbol: JSON.parse(body).data.symbol,
            max: JSON.parse(body).data.max_supply,
            price: JSON.parse(body).data.quotes.USD.price,
            cap: JSON.parse(body).data.quotes.USD.market_cap,
            chg1H: JSON.parse(body).data.quotes.USD.percent_change_1h,
            chg24H: JSON.parse(body).data.quotes.USD.percent_change_24h,
            chg7d: JSON.parse(body).data.quotes.USD.percent_change_7d,
            mktCap: cap.toLocaleString('en-US', {style:"decimal",minimumFractionDigits: 2}),
            };
          res.json(coinObject);
        };
      });
    });

    app.get("/api/compare/:id/:id2", function(req, res) {
      // Request to Coinmarketcap to get the top 100 cryptos. This call includes price, price, volume, percent change in the last 1h, 24h, 7d... Api call is limited to 100 returns. This gives back the first 100
  
      function tickerCoins(){
        let tickerUrl = "https://api.coinmarketcap.com/v2/ticker/?sort=rank";
  
        request(tickerUrl, function(error, response, body) {
          // If the request is successful
          let tickerArray =[];
          let tickerArray2 =[];
          
          function CoinObject(name, symbol, max, price, chg1H, chg24H,chg7d) {
          
            this.name = name;
            this.symbol = symbol;
            this.max = max;
            this.price = price;
            this.chg1H = chg1H;
            this.chg24H = chg24H;
            this.chg7d = chg7d;
          };
  
          // try catch to parse through bad API data
          function canParseJson(str) {
            try {
              JSON.parse(body).data[str].name;
              success = true;
            } catch (e) {
              return false;
            }
            if (success){
              tickerArray[str] = new CoinObject(JSON.parse(body).data[str].name,JSON.parse(body).data[str].symbol,JSON.parse(body).data[str].max_supply,JSON.parse(body).data[str].quotes.USD.price,JSON.parse(body).data[str].quotes.USD.percent_change_1h,JSON.parse(body).data[str].quotes.USD.percent_change_24h,JSON.parse(body).data[str].quotes.USD.percent_change_7d)
            }   
              // fills the array with a response from the API
              
          }
  
          // try catch for loop that looks through the api response and parses through the ids. need to do this because the api skips numbers.
          if (!error && response.statusCode === 200) {
            for (i=0; i< 800 ; i++){
              let success = false;
              canParseJson(i);  
            };

            let coin1 = (req.params.id).toUpperCase();
            let coin2 = (req.params.id2).toUpperCase();
            console.log(coin1,coin2);
            search(coin1,tickerArray,tickerArray2);
            search2(coin2,tickerArray,tickerArray2);
          } else {
            console.log('cant find that crypto');
          };

          // search through the API return for the two coins we are going to compare
          function search(nameKey,tickerArray,tickerArray2){  
            for (var i=1; i < tickerArray.length; i++) {
                if ((tickerArray[i].symbol === nameKey)) {
                  tickerArray2.push(tickerArray[i]);
                  return tickerArray2;
                }; 
            };
          };
          function search2(nameKey2,tickerArray,tickerArray2){  
            for (var i=1; i < 800; i++) {
              try {
                if (tickerArray[i].symbol === nameKey2) {
                  console.log('this is ticker array');
                  console.log(tickerArray);
                  console.log(tickerArray[i].symbol);
                  tickerArray2.push(tickerArray[i]);
                  console.log(tickerArray2);
                  return tickerArray2;
                }
              } catch(e) {
                console.log('this errored out ' + nameKey2)
                return false
              }
                
              }; 
            };
          res.json(tickerArray2);
        });
    };
    tickerCoins();
    
    });
  };

  let listSymbols = { id:[1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 14, 16, 18, 25, 31, 32, 34, 35, 37, 41, 42, 43, 45, 49, 50, 51, 52, 53, 56, 57, 58, 61, 63, 64, 66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80, 83, 84, 87, 88, 89, 90, 93, 99, 101, 103, 109, 113, 114, 116, 117, 118, 120, 121, 122, 125, 128, 129, 130, 131, 132, 134, 135, 138, 141, 142, 145, 148, 150, 151, 154, 159, 160, 161, 164, 168, 170, 174, 175, 181, 182, 199, 201, 205, 206, 212, 213, 215, 217, 218, 221, 224, 233, 234, 254, 257, 258, 260, 263, 268, 269, 275, 276, 278, 279, 287, 290, 291, 293, 295, 298, 304, 312, 313, 316, 317, 322, 323, 325, 328, 331, 333, 334, 337, 338, 341, 344, 350, 353, 356, 360, 362, 366, 367, 370, 372, 374, 377, 380, 382, 385, 386, 389, 400, 405, 406, 411, 415, 416, 426, 448, 450, 460, 461, 463, 467, 468, 470, 476, 477, 493, 495, 501, 502, 506, 512, 513, 520, 525, 536, 541, 543, 545, 549, 551, 558, 572, 573, 576, 584, 588, 594, 597, 601, 606, 623, 624, 625, 626, 627, 629, 633, 638, 643, 644, 654, 656, 659, 660, 666, 680, 693, 699, 702, 703, 706, 707, 708, 719, 720, 723, 729, 730, 733, 734, 747, 760, 764, 766, 778, 781, 785, 788, 789, 795, 796, 797, 799, 804, 812, 813, 814, 815, 818, 819, 823, 825, 831, 833, 836, 837, 841, 842, 853, 855, 857, 859, 865, 869, 870, 873, 890, 892, 894, 895, 898, 911, 912, 914, 916, 918, 920, 921, 924, 933, 934, 938, 939, 945, 948, 951, 954, 959, 960, 964, 965, 977, 978, 983, 986, 988, 990, 992, 993, 994, 997, 998, 999, 1002, 1004, 1008, 1010, 1011, 1018, 1019, 1020, 1022, 1026, 1027, 1028, 1032, 1033, 1035, 1038, 1042, 1044, 1045, 1048, 1050, 1052, 1053, 1058, 1062, 1063, 1066, 1069, 1070, 1073, 1082, 1084, 1085, 1087, 1089, 1090, 1093, 1100, 1104, 1106, 1107, 1109, 1110, 1111, 1113, 1120, 1123, 1125, 1128, 1131, 1135, 1136, 1139, 1141, 1146, 1147, 1148, 1151, 1153, 1154, 1155, 1156, 1159, 1164, 1165, 1168, 1169, 1172, 1173, 1175, 1176, 1180, 1182, 1185, 1191, 1193, 1194, 1195, 1198, 1200, 1206, 1208, 1209, 1210, 1212, 1213, 1214, 1216, 1218, 1222, 1223, 1226, 1229, 1230, 1234, 1238, 1241, 1243, 1244, 1247, 1248, 1249, 1250, 1251, 1252, 1254, 1256, 1257, 1259, 1264, 1266, 1268, 1269, 1271, 1274, 1275, 1276, 1279, 1281, 1282, 1283, 1284, 1285, 1286, 1288, 1291, 1294, 1297, 1298, 1299, 1303, 1304, 1306, 1307, 1308, 1309, 1310, 1312, 1313, 1315, 1320, 1321, 1322, 1323, 1330, 1334, 1336, 1340, 1341, 1343, 1348, 1351, 1352, 1353, 1356, 1357, 1358, 1359, 1360, 1361, 1366, 1367, 1368, 1371, 1374, 1375, 1376, 1379, 1380, 1381, 1382, 1385, 1387, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400, 1403, 1405, 1408, 1409, 1411, 1414, 1418, 1420, 1421, 1423, 1425, 1428, 1429, 1434, 1435, 1436, 1437, 1438, 1439, 1442, 1447, 1448, 1449, 1454, 1455, 1456, 1457, 1459, 1463, 1464, 1465, 1466, 1468, 1469, 1472, 1473, 1474, 1475, 1478, 1479, 1480, 1481, 1482, 1483, 1485, 1486, 1487, 1489, 1492, 1494, 1495, 1496, 1497, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1509, 1510, 1511, 1513, 1514, 1515, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1533, 1534, 1535, 1539, 1542, 1544, 1546, 1548, 1550, 1551, 1552, 1554, 1555, 1556, 1558, 1559, 1561, 1562, 1563, 1565, 1566, 1567, 1568, 1570, 1575, 1576, 1577, 1578, 1579, 1581, 1582, 1586, 1587, 1588],
    symbol:['BTC','LTC','NMC','TRC','PPC','NVC','FTC','MNC','FRC','IXC','BTB','WDC','DGC','GLD','ARG','FST','BTG','PXC','MEC','IFC','XPM','ANC','CSC','CBX','EMD','GLC','XRP','QRK','ZET','SRC','SXC','TAG','I0C','FLO','NXT','UNO','XJO','DTC','BET','GDC','DEM','DOGE','NET','PHS','DMD','HBN','TGC','ORB','OMNI','CAT','TIPS','RPC','MOON','DIME','42','VTC','KDC','RED','DGB','SMC','TES','KARMA','NOBL','RDD','NYAN','UTC','POT','BLC','MAX','Q2C','HUC','DASH','XCP','CACH','TOP','ICN','MINT','ARI','DOPE','AUR','ANI','PTC','MARS','CASH','RIC','PND','MZC','UFO','BLK','LTB','PHO','ZEIT','XMY','SKC','EMC2','BTCS','CNO','ECC','MONA','RBY','BELA','FLT','888','FAIR','SLR','EFL','NLG','PLC','GRS','XPD','PLNC','XWC','AC','POP','BITS','QBC','CCN','SLOTH','BLU','MAID','XBC','TALK','NYC','CDN','GUN','PINK','DRM','CFC','ENRG','VRC','TEK','XMR','LCP','CURE','UNB','CRYPT','QCN','SUPER','QORA','BOST','HYPER','BTQ','MOTO','CLOAK','BSD','C2','FCN','BCN','ABY','NAV','URO','GRN','DON','PIGGY','START','KORE','XDN','BBR','SHA','BLZ','THC','BRIT','XST','TRUST','CLAM','QTL','BTS','BTCD','TRK','VIA','FIRE','TRI','SDC','IOC','XCN','CARBON','CANN','XLM','TIT','VTA','HYP','J','SYS','BTM','HAL','SJCX','NEOS','EMC','RBBT','BURST','GAME','WSX','UBQ','BUN','OPAL','ACOIN','FLDC','BITUSD','BITCNY','BITBTC','USNBT','SLG','XMG','EXCL','TROLL','UNITY','BSTY','DP','PXI','SWIFT','DSH','AU','STV','XVG','NSR','SPR','RBT','MUE','BLOCK','GAP','TTC','CRW','BAY','BLITZ','GCN','XQN','BYC','BCF','OK','XPY','VTR','BITGOLD','UIS','GP','COVAL','NXS','SOON','METAL','NKA','SMLY','AMBER','MAC','BITSILVER','DOT','KOBO','CON','BITB','GEO','USDT','WBB','GRC','XVC','XCO','SAK','BITZ','LDOGE','UNC','SONG','LOG','SLFI','CRAVE','PURA','XEM','8BIT','LEA','NTRN','XAUR','CF','AIB','EGG','SPHR','MEDIC','BUB','MUSE','UNIT','SHELL','CTO','PKB','ARB','GAM','BTA','ADC','SNRG','BITEUR','UNIC','FJC','ERC','FUNK','HXX','XRA','MTLMC3','CREVA','IRL','ZNY','CYC','BSC','ACP','TAGR','CPN','CHC','SPRTS','HNC','CPC','FLAX','OFF','BIOS','MANNA','AXIOM','LEO','AEON','ETH','SJW','TX','GCC','AMS','EUC','SC','GCR','DCRE','MAD','SHIFT','VEC2','BOLI','SPACE','FLY','BCY','PAK','INFX','EXP','STEPS','SIB','ISL','SWING','FCT','DUO','SANDG','PR','CUBE','REP','SHND','$PAC','1337','$$$','SOIL','SCRT','DFT','OBITS','AMP','GBC','X2','CLUB','ADZ','MND','MOIN','AV','RC','EGC','OPES','CRB','RADS','LTCR','YOC','SLS','FRN','EVIL','DCR','PIVX','SAFEX','HMP','RBIES','ADCN','DES','KLC','TRUMP','MEME','XCT','IMS','HODL','BIGUP','NEVA','BUMBA','RVR','PEX','CAB','MOJO','GMX','LSK','EDRC','POST','OP','BERN','QWARK','DGD','STEEM','FANS','ESP','FUZZ','DISK','XHI','ARCO','XBTC21','EL','ZUR','611','2GIVE','XPTX','ABC','LANA','PONZI','TESLA','MXT','NLX','RICHX','PRM','WAVES','NEWB','ICOO','PWR','ION','HVCO','MNM','XRE','GB','BRK','DBTC','CMT','RISE','CHESS','LBC','PUT','BRX','SYNX','CJ','REE','HEAT','LIR','DLISK','SBD','LKC','CRX','ARDR','ETC','808','BIT','POKE','ELE','GAIN','KRB','VPRC','STRAT','PRES','ACES','GARY','TAJ','TODAY','PX','EDR','BXT','THS','ATX','AGLC','XP','VLT','KB3','BLOCKPAY','GOLF','NEO','JWL','LMC','BTDX','NLC2','SPORT','VRM','ZYD','JIN','XTO','PLU','TELL','SH','DLC','MST','XBTS','PROUD','SEQ','OMC','1ST','PEPECASH','ICN','SNGLS','CALC','XZC','RCN','ATOM','JOBS','TRIG','SKR','ROYAL','LEVO','ARC','QBT','DMC','ZEC','IMPS','ASAFE2','BIP','ZCL','ZOI','WA','LKK','GNT','ZMC','BTCR','REGA','BASH','IOP','VRS','HUSH','KURT','XCRE','XRC','PASC','ENT','INCNT','DCT','NODC','GOLOS','NXC','SHORTY','VSL','DOLLAR','VLTC','PCS','TCOIN','GBYTE','BPC','POSW','LUNA','FRGC','WINGS','DIX','UNITS','DAR','IFLT','XSPEC','XSTC','LDCN','BENJI','CCRB','VIDZ','BCC','ICOB','IBANK','MKR','PRX','DRS','KMD','FRST','MGM','TSE','SFC','ZBC','WCT','ICON','KUSH','LEPEN','GCC','ACN','BOAT','ERY','ELS','GBG','CWXT','CNT','MAR','MSCN','KASHH','MLN','ALL','PRC','TIME','ARGUS','RNS','UR','SWT','PIE','MARX','VISIO','NANO','LVPS','GEERT','PASL','MILO','MUSIC','ZER','BIOB','HONEY','NETKO','ARK','DYN','TKS' ]
    }

  
