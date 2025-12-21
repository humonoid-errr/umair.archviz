(function(){
var translateObjs = {};
function trans(a, b) {
    var c = arguments['length'] === 0x1 ? [arguments[0x0]] : Array['apply'](null, arguments);
    return translateObjs[c[0x0]] = c, '';
}
function regTextVar(a, b) {
    var c = ![];
    return d(b);
    function d(k, l) {
        switch (k['toLowerCase']()) {
        case 'title':
        case 'subtitle':
        case 'photo.title':
        case 'photo.description':
            var m = (function () {
                switch (k['toLowerCase']()) {
                case 'title':
                case 'photo.title':
                    return 'media.label';
                case 'subtitle':
                    return 'media.data.subtitle';
                case 'photo.description':
                    return 'media.data.description';
                }
            }());
            if (m)
                return function () {
                    var r, s, t = (l && l['viewerName'] ? this['getComponentByName'](l['viewerName']) : undefined) || this['getMainViewer']();
                    if (k['toLowerCase']()['startsWith']('photo'))
                        r = this['getByClassName']('PhotoAlbumPlayListItem')['filter'](function (v) {
                            var w = v['get']('player');
                            return w && w['get']('viewerArea') == t;
                        })['map'](function (v) {
                            return v['get']('media')['get']('playList');
                        });
                    else
                        r = this['_getPlayListsWithViewer'](t), s = j['bind'](this, t);
                    if (!c) {
                        for (var u = 0x0; u < r['length']; ++u) {
                            r[u]['bind']('changing', f, this);
                        }
                        c = !![];
                    }
                    return i['call'](this, r, m, s);
                };
            break;
        case 'tour.name':
        case 'tour.description':
            return function () {
                return this['get']('data')['tour']['locManager']['trans'](k);
            };
        default:
            if (k['toLowerCase']()['startsWith']('viewer.')) {
                var n = k['split']('.'), o = n[0x1];
                if (o) {
                    var p = n['slice'](0x2)['join']('.');
                    return d(p, { 'viewerName': o });
                }
            } else {
                if (k['toLowerCase']()['startsWith']('quiz.') && 'Quiz' in TDV) {
                    var q = undefined, m = (function () {
                            switch (k['toLowerCase']()) {
                            case 'quiz.questions.answered':
                                return TDV['Quiz']['PROPERTY']['QUESTIONS_ANSWERED'];
                            case 'quiz.question.count':
                                return TDV['Quiz']['PROPERTY']['QUESTION_COUNT'];
                            case 'quiz.items.found':
                                return TDV['Quiz']['PROPERTY']['ITEMS_FOUND'];
                            case 'quiz.item.count':
                                return TDV['Quiz']['PROPERTY']['ITEM_COUNT'];
                            case 'quiz.score':
                                return TDV['Quiz']['PROPERTY']['SCORE'];
                            case 'quiz.score.total':
                                return TDV['Quiz']['PROPERTY']['TOTAL_SCORE'];
                            case 'quiz.time.remaining':
                                return TDV['Quiz']['PROPERTY']['REMAINING_TIME'];
                            case 'quiz.time.elapsed':
                                return TDV['Quiz']['PROPERTY']['ELAPSED_TIME'];
                            case 'quiz.time.limit':
                                return TDV['Quiz']['PROPERTY']['TIME_LIMIT'];
                            case 'quiz.media.items.found':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_ITEMS_FOUND'];
                            case 'quiz.media.item.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_ITEM_COUNT'];
                            case 'quiz.media.questions.answered':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                            case 'quiz.media.question.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_QUESTION_COUNT'];
                            case 'quiz.media.score':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_SCORE'];
                            case 'quiz.media.score.total':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_TOTAL_SCORE'];
                            case 'quiz.media.index':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'];
                            case 'quiz.media.count':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_COUNT'];
                            case 'quiz.media.visited':
                                return TDV['Quiz']['PROPERTY']['PANORAMA_VISITED_COUNT'];
                            default:
                                var s = /quiz\.([\w_]+)\.(.+)/['exec'](k);
                                if (s) {
                                    q = s[0x1];
                                    switch ('quiz.' + s[0x2]) {
                                    case 'quiz.score':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['SCORE'];
                                    case 'quiz.score.total':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['TOTAL_SCORE'];
                                    case 'quiz.media.items.found':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEMS_FOUND'];
                                    case 'quiz.media.item.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_ITEM_COUNT'];
                                    case 'quiz.media.questions.answered':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTIONS_ANSWERED'];
                                    case 'quiz.media.question.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_QUESTION_COUNT'];
                                    case 'quiz.questions.answered':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTIONS_ANSWERED'];
                                    case 'quiz.question.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['QUESTION_COUNT'];
                                    case 'quiz.items.found':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEMS_FOUND'];
                                    case 'quiz.item.count':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['ITEM_COUNT'];
                                    case 'quiz.media.score':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_SCORE'];
                                    case 'quiz.media.score.total':
                                        return TDV['Quiz']['OBJECTIVE_PROPERTY']['PANORAMA_TOTAL_SCORE'];
                                    }
                                }
                            }
                        }());
                    if (m)
                        return function () {
                            var r = this['get']('data')['quiz'];
                            if (r) {
                                if (!c) {
                                    if (q != undefined) {
                                        if (q == 'global') {
                                            var s = this['get']('data')['quizConfig'], t = s['objectives'];
                                            for (var u = 0x0, v = t['length']; u < v; ++u) {
                                                r['bind'](TDV['Quiz']['EVENT_OBJECTIVE_PROPERTIES_CHANGE'], h['call'](this, t[u]['id'], m), this);
                                            }
                                        } else
                                            r['bind'](TDV['Quiz']['EVENT_OBJECTIVE_PROPERTIES_CHANGE'], h['call'](this, q, m), this);
                                    } else
                                        r['bind'](TDV['Quiz']['EVENT_PROPERTIES_CHANGE'], g['call'](this, m), this);
                                    c = !![];
                                }
                                try {
                                    var w = 0x0;
                                    if (q != undefined) {
                                        if (q == 'global') {
                                            var s = this['get']('data')['quizConfig'], t = s['objectives'];
                                            for (var u = 0x0, v = t['length']; u < v; ++u) {
                                                w += r['getObjective'](t[u]['id'], m);
                                            }
                                        } else
                                            w = r['getObjective'](q, m);
                                    } else {
                                        w = r['get'](m);
                                        if (m == TDV['Quiz']['PROPERTY']['PANORAMA_INDEX'])
                                            w += 0x1;
                                    }
                                    return w;
                                } catch (x) {
                                    return undefined;
                                }
                            }
                        };
                }
            }
            break;
        }
        return function () {
            return '';
        };
    }
    function e() {
        var k = this['get']('data');
        k['updateText'](k['translateObjs'][a]);
    }
    function f(k) {
        var l = k['data']['nextSelectedIndex'];
        if (l >= 0x0) {
            var m = k['source']['get']('items')[l], n = function () {
                    m['unbind']('begin', n, this), e['call'](this);
                };
            m['bind']('begin', n, this);
        }
    }
    function g(k) {
        return function (l) {
            k in l && e['call'](this);
        }['bind'](this);
    }
    function h(k, l) {
        return function (m, n) {
            k == m && l in n && e['call'](this);
        }['bind'](this);
    }
    function i(k, l, m) {
        for (var n = 0x0; n < k['length']; ++n) {
            var o = k[n], p = o['get']('selectedIndex');
            if (p >= 0x0) {
                var q = l['split']('.'), r = o['get']('items')[p];
                if (m !== undefined && !m['call'](this, r))
                    continue;
                for (var s = 0x0; s < q['length']; ++s) {
                    if (r == undefined)
                        return '';
                    r = 'get' in r ? r['get'](q[s]) : r[q[s]];
                }
                return r;
            }
        }
        return '';
    }
    function j(k, l) {
        var m = l['get']('player');
        return m !== undefined && m['get']('viewerArea') == k;
    }
}
var script = {"children":["this.MainViewer_mobile","this.Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile","this.Image_16F96C6E_070E_1C38_4195_0E15C66E50D4_mobile","this.Image_16FDB4E9_070E_6C38_4191_F1C8D18930A0_mobile","this.Image_15A52807_0736_23E8_4197_B2E332E55819_mobile","this.Image_152BBAC9_0737_E478_4189_5588737E2F4E_mobile","this.Image_1526E375_0736_2428_4197_ACD4651C05E3_mobile","this.Image_1525F5E3_0736_2C28_416F_0582B2471858_mobile","this.Image_152A845C_0736_6C18_419A_FCE21BA158BC_mobile","this.Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile"],"backgroundColorRatios":[0],"minHeight":0,"start":"this.init(); if(!this.get('fullscreenAvailable')) { [this.Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile].forEach(function(component) { if(component.get('class') != 'ViewerArea') component.set('visible', false); }) }","minWidth":0,"data":{"history":{},"textToSpeechConfig":{"pitch":1,"speechOnQuizQuestion":false,"rate":1,"volume":1,"stopBackgroundAudio":false,"speechOnTooltip":false,"speechOnInfoWindow":false},"defaultLocale":"en","displayTooltipInTouchScreens":true,"name":"Player1530","locales":{"en":"locale/en.txt"}},"backgroundColor":["#FFFFFF"],"id":"rootPlayer","scrollBarMargin":2,"scrollBarColor":"#000000","class":"Player","propagateClick":false,"scripts":{"changeBackgroundWhilePlay":TDV.Tour.Script.changeBackgroundWhilePlay,"existsKey":TDV.Tour.Script.existsKey,"changeOpacityWhilePlay":TDV.Tour.Script.changeOpacityWhilePlay,"setComponentsVisibilityByTags":TDV.Tour.Script.setComponentsVisibilityByTags,"showPopupImage":TDV.Tour.Script.showPopupImage,"fixTogglePlayPauseButton":TDV.Tour.Script.fixTogglePlayPauseButton,"getComponentByName":TDV.Tour.Script.getComponentByName,"pauseGlobalAudio":TDV.Tour.Script.pauseGlobalAudio,"clone":TDV.Tour.Script.clone,"takeScreenshot":TDV.Tour.Script.takeScreenshot,"getComponentsByTags":TDV.Tour.Script.getComponentsByTags,"historyGoForward":TDV.Tour.Script.historyGoForward,"updateIndexGlobalZoomImage":TDV.Tour.Script.updateIndexGlobalZoomImage,"historyGoBack":TDV.Tour.Script.historyGoBack,"getMediaFromPlayer":TDV.Tour.Script.getMediaFromPlayer,"getMediaWidth":TDV.Tour.Script.getMediaWidth,"quizPauseTimer":TDV.Tour.Script.quizPauseTimer,"setOverlayBehaviour":TDV.Tour.Script.setOverlayBehaviour,"showPopupPanoramaOverlay":TDV.Tour.Script.showPopupPanoramaOverlay,"toggleMeasurementsVisibility":TDV.Tour.Script.toggleMeasurementsVisibility,"pauseGlobalAudios":TDV.Tour.Script.pauseGlobalAudios,"getActiveMediaWithViewer":TDV.Tour.Script.getActiveMediaWithViewer,"openLink":TDV.Tour.Script.openLink,"changePlayListWithSameSpot":TDV.Tour.Script.changePlayListWithSameSpot,"quizResumeTimer":TDV.Tour.Script.quizResumeTimer,"updateMediaLabelFromPlayList":TDV.Tour.Script.updateMediaLabelFromPlayList,"quizShowScore":TDV.Tour.Script.quizShowScore,"getMediaHeight":TDV.Tour.Script.getMediaHeight,"getPixels":TDV.Tour.Script.getPixels,"setEndToItemIndex":TDV.Tour.Script.setEndToItemIndex,"initAnalytics":TDV.Tour.Script.initAnalytics,"setOverlaysVisibility":TDV.Tour.Script.setOverlaysVisibility,"setMeasurementUnits":TDV.Tour.Script.setMeasurementUnits,"setMainMediaByIndex":TDV.Tour.Script.setMainMediaByIndex,"stopAndGoCamera":TDV.Tour.Script.stopAndGoCamera,"quizShowTimeout":TDV.Tour.Script.quizShowTimeout,"showWindow":TDV.Tour.Script.showWindow,"setOverlaysVisibilityByTags":TDV.Tour.Script.setOverlaysVisibilityByTags,"playAudioList":TDV.Tour.Script.playAudioList,"cloneGeneric":TDV.Tour.Script.cloneGeneric,"getActivePlayerWithViewer":TDV.Tour.Script.getActivePlayerWithViewer,"quizStart":TDV.Tour.Script.quizStart,"getModel3DInnerObject":TDV.Tour.Script.getModel3DInnerObject,"getActivePlayersWithViewer":TDV.Tour.Script.getActivePlayersWithViewer,"showPopupPanoramaVideoOverlay":TDV.Tour.Script.showPopupPanoramaVideoOverlay,"startModel3DWithCameraSpot":TDV.Tour.Script.startModel3DWithCameraSpot,"initOverlayGroupRotationOnClick":TDV.Tour.Script.initOverlayGroupRotationOnClick,"cloneBindings":TDV.Tour.Script.cloneBindings,"getAudioByTags":TDV.Tour.Script.getAudioByTags,"initQuiz":TDV.Tour.Script.initQuiz,"setMainMediaByName":TDV.Tour.Script.setMainMediaByName,"setPanoramaCameraWithSpot":TDV.Tour.Script.setPanoramaCameraWithSpot,"_getObjectsByTags":TDV.Tour.Script._getObjectsByTags,"_initSplitViewer":TDV.Tour.Script._initSplitViewer,"clonePanoramaCamera":TDV.Tour.Script.clonePanoramaCamera,"syncPlaylists":TDV.Tour.Script.syncPlaylists,"startPanoramaWithModel":TDV.Tour.Script.startPanoramaWithModel,"resumePlayers":TDV.Tour.Script.resumePlayers,"playGlobalAudioWhilePlayActiveMedia":TDV.Tour.Script.playGlobalAudioWhilePlayActiveMedia,"setPlayListSelectedIndex":TDV.Tour.Script.setPlayListSelectedIndex,"getOverlaysByGroupname":TDV.Tour.Script.getOverlaysByGroupname,"setSurfaceSelectionHotspotMode":TDV.Tour.Script.setSurfaceSelectionHotspotMode,"getOverlays":TDV.Tour.Script.getOverlays,"setMediaBehaviour":TDV.Tour.Script.setMediaBehaviour,"init":TDV.Tour.Script.init,"copyToClipboard":TDV.Tour.Script.copyToClipboard,"setDirectionalPanoramaAudio":TDV.Tour.Script.setDirectionalPanoramaAudio,"visibleComponentsIfPlayerFlagEnabled":TDV.Tour.Script.visibleComponentsIfPlayerFlagEnabled,"quizFinish":TDV.Tour.Script.quizFinish,"createTween":TDV.Tour.Script.createTween,"getMainViewer":TDV.Tour.Script.getMainViewer,"copyObjRecursively":TDV.Tour.Script.copyObjRecursively,"_initTwinsViewer":TDV.Tour.Script._initTwinsViewer,"setPanoramaCameraWithCurrentSpot":TDV.Tour.Script.setPanoramaCameraWithCurrentSpot,"mixObject":TDV.Tour.Script.mixObject,"isCardboardViewMode":TDV.Tour.Script.isCardboardViewMode,"getPanoramaOverlayByName":TDV.Tour.Script.getPanoramaOverlayByName,"disableVR":TDV.Tour.Script.disableVR,"isPanorama":TDV.Tour.Script.isPanorama,"getOverlaysByTags":TDV.Tour.Script.getOverlaysByTags,"getPanoramaOverlaysByTags":TDV.Tour.Script.getPanoramaOverlaysByTags,"resumeGlobalAudios":TDV.Tour.Script.resumeGlobalAudios,"playGlobalAudioWhilePlay":TDV.Tour.Script.playGlobalAudioWhilePlay,"stopGlobalAudios":TDV.Tour.Script.stopGlobalAudios,"startMeasurement":TDV.Tour.Script.startMeasurement,"getCurrentPlayerWithMedia":TDV.Tour.Script.getCurrentPlayerWithMedia,"startPanoramaWithCamera":TDV.Tour.Script.startPanoramaWithCamera,"textToSpeech":TDV.Tour.Script.textToSpeech,"enableVR":TDV.Tour.Script.enableVR,"getPlayListsWithMedia":TDV.Tour.Script.getPlayListsWithMedia,"getCurrentPlayers":TDV.Tour.Script.getCurrentPlayers,"updateVideoCues":TDV.Tour.Script.updateVideoCues,"keepCompVisible":TDV.Tour.Script.keepCompVisible,"playGlobalAudio":TDV.Tour.Script.playGlobalAudio,"getGlobalAudio":TDV.Tour.Script.getGlobalAudio,"toggleVR":TDV.Tour.Script.toggleVR,"setStartTimeVideo":TDV.Tour.Script.setStartTimeVideo,"restartTourWithoutInteraction":TDV.Tour.Script.restartTourWithoutInteraction,"setModel3DCameraSpot":TDV.Tour.Script.setModel3DCameraSpot,"_initItemWithComps":TDV.Tour.Script._initItemWithComps,"stopMeasurement":TDV.Tour.Script.stopMeasurement,"setModel3DCameraWithCurrentSpot":TDV.Tour.Script.setModel3DCameraWithCurrentSpot,"setStartTimeVideoSync":TDV.Tour.Script.setStartTimeVideoSync,"createTweenModel3D":TDV.Tour.Script.createTweenModel3D,"_getPlayListsWithViewer":TDV.Tour.Script._getPlayListsWithViewer,"stopGlobalAudio":TDV.Tour.Script.stopGlobalAudio,"textToSpeechComponent":TDV.Tour.Script.textToSpeechComponent,"getPlayListWithItem":TDV.Tour.Script.getPlayListWithItem,"_initTTSTooltips":TDV.Tour.Script._initTTSTooltips,"getFirstPlayListWithMedia":TDV.Tour.Script.getFirstPlayListWithMedia,"loadFromCurrentMediaPlayList":TDV.Tour.Script.loadFromCurrentMediaPlayList,"downloadFile":TDV.Tour.Script.downloadFile,"quizSetItemFound":TDV.Tour.Script.quizSetItemFound,"sendAnalyticsData":TDV.Tour.Script.sendAnalyticsData,"executeAudioAction":TDV.Tour.Script.executeAudioAction,"stopTextToSpeech":TDV.Tour.Script.stopTextToSpeech,"getPlayListItems":TDV.Tour.Script.getPlayListItems,"skip3DTransitionOnce":TDV.Tour.Script.skip3DTransitionOnce,"registerKey":TDV.Tour.Script.registerKey,"htmlToPlainText":TDV.Tour.Script.htmlToPlainText,"setCameraSameSpotAsMedia":TDV.Tour.Script.setCameraSameSpotAsMedia,"setModel3DCameraSequence":TDV.Tour.Script.setModel3DCameraSequence,"cleanAllMeasurements":TDV.Tour.Script.cleanAllMeasurements,"toggleTextToSpeechComponent":TDV.Tour.Script.toggleTextToSpeechComponent,"setObjectsVisibility":TDV.Tour.Script.setObjectsVisibility,"toggleMeasurement":TDV.Tour.Script.toggleMeasurement,"getPlayListItemByMedia":TDV.Tour.Script.getPlayListItemByMedia,"getKey":TDV.Tour.Script.getKey,"getPlayListItemIndexByMedia":TDV.Tour.Script.getPlayListItemIndexByMedia,"executeAudioActionByTags":TDV.Tour.Script.executeAudioActionByTags,"setObjectsVisibilityByTags":TDV.Tour.Script.setObjectsVisibilityByTags,"getMediaByName":TDV.Tour.Script.getMediaByName,"setObjectsVisibilityByID":TDV.Tour.Script.setObjectsVisibilityByID,"assignObjRecursively":TDV.Tour.Script.assignObjRecursively,"pauseCurrentPlayers":TDV.Tour.Script.pauseCurrentPlayers,"cleanSelectedMeasurements":TDV.Tour.Script.cleanSelectedMeasurements,"quizShowQuestion":TDV.Tour.Script.quizShowQuestion,"openEmbeddedPDF":TDV.Tour.Script.openEmbeddedPDF,"executeJS":TDV.Tour.Script.executeJS,"autotriggerAtStart":TDV.Tour.Script.autotriggerAtStart,"getQuizTotalObjectiveProperty":TDV.Tour.Script.getQuizTotalObjectiveProperty,"setMapLocation":TDV.Tour.Script.setMapLocation,"unregisterKey":TDV.Tour.Script.unregisterKey,"setComponentVisibility":TDV.Tour.Script.setComponentVisibility,"pauseGlobalAudiosWhilePlayItem":TDV.Tour.Script.pauseGlobalAudiosWhilePlayItem,"executeFunctionWhenChange":TDV.Tour.Script.executeFunctionWhenChange,"getMediaByTags":TDV.Tour.Script.getMediaByTags,"shareSocial":TDV.Tour.Script.shareSocial,"translate":TDV.Tour.Script.translate,"setMeasurementsVisibility":TDV.Tour.Script.setMeasurementsVisibility,"setValue":TDV.Tour.Script.setValue,"showComponentsWhileMouseOver":TDV.Tour.Script.showComponentsWhileMouseOver,"getRootOverlay":TDV.Tour.Script.getRootOverlay,"showPopupMedia":TDV.Tour.Script.showPopupMedia,"triggerOverlay":TDV.Tour.Script.triggerOverlay,"updateDeepLink":TDV.Tour.Script.updateDeepLink,"getStateTextToSpeech":TDV.Tour.Script.getStateTextToSpeech,"setLocale":TDV.Tour.Script.setLocale},"layout":"absolute","width":"100%","defaultMenu":["fullscreen","mute","rotation"],"height":"100%","gap":10,"hash": "e5038dcd17038ed1a08757eb1477dcbc30b6750c6f2779b673a55d18c155f3d5", "definitions": [{"maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_1526E375_0736_2428_4197_ACD4651C05E3_mobile","horizontalAlign":"center","left":"22.93%","data":{"name":"Floor Level"},"url":trans('Image_1526E375_0736_2428_4197_ACD4651C05E3_mobile.url'),"class":"Image","propagateClick":false,"bottom":"3.07%","width":"9.167%","verticalAlign":"middle","backgroundOpacity":0,"height":"4.749%","scaleMode":"fit_inside","maxHeight":75},{"id":"effect_024BA213_0D68_0127_41AA_CBFD39DFCEAF","duration":500,"class":"FadeInEffect"},{"class":"Panorama","adjacentPanoramas":[{"data":{"overlayID":"overlay_086FB2C6_0712_2468_418A_C29910B08BB9"},"backwardYaw":72.08,"distance":5.92,"yaw":77.06,"select":"this.overlay_086FB2C6_0712_2468_418A_C29910B08BB9.get('areas').forEach(function(a){ a.trigger('click') })","class":"AdjacentPanorama","panorama":"this.panorama_0B95A329_070E_243B_4181_DC16F40FFAF1"},{"data":{"overlayID":"overlay_08657AB2_0716_6428_4192_E275D79F91BC"},"backwardYaw":-90.7,"distance":3.91,"yaw":163.46,"select":"this.overlay_08657AB2_0716_6428_4192_E275D79F91BC.get('areas').forEach(function(a){ a.trigger('click') })","class":"AdjacentPanorama","panorama":"this.panorama_0C3C01F6_070E_6428_4198_98AB86F49766"}],"id":"panorama_0C3C2059_070E_6418_4197_ECE4147C7478","hfovMin":"120%","thumbnailUrl":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_t.webp","data":{"label":"Scene 43"},"frames":[{"cube":{"class":"ImageResource","levels":[{"height":3072,"url":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_0/{face}/0/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":36,"tags":"ondemand","rowCount":6,"width":18432},{"height":1536,"url":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_0/{face}/1/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":18,"tags":"ondemand","rowCount":3,"width":9216},{"height":1024,"url":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_0/{face}/2/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":12,"tags":"ondemand","rowCount":2,"width":6144},{"height":512,"url":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_0/{face}/3/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":6,"tags":["ondemand","preload"],"rowCount":1,"width":3072}]},"class":"CubicPanoramaFrame","thumbnailUrl":"media/panorama_0C3C2059_070E_6418_4197_ECE4147C7478_t.webp"}],"overlays":["this.overlay_08657AB2_0716_6428_4192_E275D79F91BC","this.overlay_086FB2C6_0712_2468_418A_C29910B08BB9"],"hfov":360,"label":trans('panorama_0C3C2059_070E_6418_4197_ECE4147C7478.label'),"vfov":180,"hfovMax":130},{"maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_152BBAC9_0737_E478_4189_5588737E2F4E_mobile","horizontalAlign":"center","left":"11.99%","data":{"name":"YT Video"},"url":trans('Image_152BBAC9_0737_E478_4189_5588737E2F4E_mobile.url'),"class":"Image","propagateClick":false,"bottom":"3.09%","width":"9.514%","verticalAlign":"middle","backgroundOpacity":0,"height":"5.006%","scaleMode":"fit_inside","maxHeight":75},{"id":"effect_024B8213_0D68_0127_4190_6EF2541E164B","duration":500,"class":"FadeOutEffect"},{"id":"effect_0247F5D0_0D68_0322_418C_9FCA28E49BF4","duration":500,"class":"FadeOutEffect"},{"class":"Panorama","adjacentPanoramas":[{"data":{"overlayID":"overlay_169E6912_070E_25E8_4190_057C1B979F45"},"backwardYaw":77.06,"distance":5.59,"yaw":72.08,"select":"this.overlay_169E6912_070E_25E8_4190_057C1B979F45.get('areas').forEach(function(a){ a.trigger('click') })","class":"AdjacentPanorama","panorama":"this.panorama_0C3C2059_070E_6418_4197_ECE4147C7478"}],"id":"panorama_0B95A329_070E_243B_4181_DC16F40FFAF1","hfovMin":"120%","thumbnailUrl":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_t.webp","data":{"label":"Panorama(1)"},"frames":[{"cube":{"class":"ImageResource","levels":[{"height":3072,"url":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_0/{face}/0/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":36,"tags":"ondemand","rowCount":6,"width":18432},{"height":1536,"url":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_0/{face}/1/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":18,"tags":"ondemand","rowCount":3,"width":9216},{"height":1024,"url":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_0/{face}/2/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":12,"tags":"ondemand","rowCount":2,"width":6144},{"height":512,"url":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_0/{face}/3/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":6,"tags":["ondemand","preload"],"rowCount":1,"width":3072}]},"class":"CubicPanoramaFrame","thumbnailUrl":"media/panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_t.webp"}],"overlays":["this.overlay_169E6912_070E_25E8_4190_057C1B979F45"],"hfov":360,"label":trans('panorama_0B95A329_070E_243B_4181_DC16F40FFAF1.label'),"vfov":180,"hfovMax":130},{"click":"var invisibleFunc = function(component) { this.setComponentVisibility(component, false, 0, this.effect_0247F5D0_0D68_0322_418C_9FCA28E49BF4, 'hideEffect', false)}.bind(this); invisibleFunc(this.Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile); var visibleFunc = function(component) { this.setComponentVisibility(component, true, 0, this.effect_0263B512_0FD8_133B_41A1_4FF3CEF3BD5B, 'showEffect', false)}.bind(this); visibleFunc(this.Image_1526E375_0736_2428_4197_ACD4651C05E3_mobile); visibleFunc(this.Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile); visibleFunc(this.Image_15A52807_0736_23E8_4197_B2E332E55819_mobile); visibleFunc(this.Image_16FDB4E9_070E_6C38_4191_F1C8D18930A0_mobile); visibleFunc(this.Image_152BBAC9_0737_E478_4189_5588737E2F4E_mobile); visibleFunc(this.Image_152A845C_0736_6C18_419A_FCE21BA158BC_mobile); visibleFunc(this.Image_1525F5E3_0736_2C28_416F_0582B2471858_mobile); visibleFunc(this.Image_16F96C6E_070E_1C38_4195_0E15C66E50D4_mobile)","maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_0262E73B_0D68_0F66_41A9_E61EB52ECC69_mobile","horizontalAlign":"center","left":"42.1%","toolTipShadowColor":"#333138","toolTipTextShadowColor":"#000000","toolTipFontColor":"#606060","data":{"name":"Image"},"url":trans('Image_0262E73B_0D68_0F66_41A9_E61EB52ECC69_mobile.url'),"toolTipPaddingRight":3,"toolTip":trans('Image_0262E73B_0D68_0F66_41A9_E61EB52ECC69_mobile.toolTip'),"toolTipFontFamily":"Arial","class":"Image","propagateClick":false,"toolTipFontSize":"1.11vmin","toolTipShadowBlurRadius":1,"bottom":"2.55%","toolTipPaddingLeft":3,"width":"13.569%","toolTipBackgroundColor":"#F6F6F6","toolTipTextShadowBlurRadius":1,"toolTipBorderColor":"#767676","backgroundOpacity":0,"height":"4.619%","toolTipBorderRadius":1,"verticalAlign":"middle","scaleMode":"fit_inside","maxHeight":75},{"id":"mainPlayList","items":[{"camera":"this.panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_camera","media":"this.panorama_0B95A329_070E_243B_4181_DC16F40FFAF1","class":"PanoramaPlayListItem","player":"this.MainViewer_mobilePanoramaPlayer","begin":"this.setEndToItemIndex(this.mainPlayList, 0, 1)"},{"camera":"this.panorama_0C3C01F6_070E_6428_4198_98AB86F49766_camera","media":"this.panorama_0C3C01F6_070E_6428_4198_98AB86F49766","class":"PanoramaPlayListItem","player":"this.MainViewer_mobilePanoramaPlayer","begin":"this.setEndToItemIndex(this.mainPlayList, 1, 2)"},{"camera":"this.panorama_0C3C2059_070E_6418_4197_ECE4147C7478_camera","media":"this.panorama_0C3C2059_070E_6418_4197_ECE4147C7478","class":"PanoramaPlayListItem","end":"this.trigger('tourEnded')","player":"this.MainViewer_mobilePanoramaPlayer","begin":"this.setEndToItemIndex(this.mainPlayList, 2, 0)"}],"class":"PlayList"},{"class":"Panorama","adjacentPanoramas":[{"data":{"overlayID":"overlay_08BAA50E_071E_2DF8_417B_4A69ECFD72B4"},"backwardYaw":163.46,"distance":4.51,"yaw":-90.7,"select":"this.overlay_08BAA50E_071E_2DF8_417B_4A69ECFD72B4.get('areas').forEach(function(a){ a.trigger('click') })","class":"AdjacentPanorama","panorama":"this.panorama_0C3C2059_070E_6418_4197_ECE4147C7478"}],"id":"panorama_0C3C01F6_070E_6428_4198_98AB86F49766","hfovMin":"120%","thumbnailUrl":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_t.webp","data":{"label":"Scene 42"},"frames":[{"cube":{"class":"ImageResource","levels":[{"height":3072,"url":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_0/{face}/0/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":36,"tags":"ondemand","rowCount":6,"width":18432},{"height":1536,"url":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_0/{face}/1/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":18,"tags":"ondemand","rowCount":3,"width":9216},{"height":1024,"url":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_0/{face}/2/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":12,"tags":"ondemand","rowCount":2,"width":6144},{"height":512,"url":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_0/{face}/3/{row}_{column}.webp","class":"TiledImageResourceLevel","colCount":6,"tags":["ondemand","preload"],"rowCount":1,"width":3072}]},"class":"CubicPanoramaFrame","thumbnailUrl":"media/panorama_0C3C01F6_070E_6428_4198_98AB86F49766_t.webp"}],"overlays":["this.overlay_08BAA50E_071E_2DF8_417B_4A69ECFD72B4"],"hfov":360,"label":trans('panorama_0C3C01F6_070E_6428_4198_98AB86F49766.label'),"vfov":180,"hfovMax":130},{"id":"effect_0263B512_0FD8_133B_41A1_4FF3CEF3BD5B","duration":500,"class":"FadeInEffect"},{"click":"this.set('fullscreenEnabled', !this.get('fullscreenEnabled'))","maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile","horizontalAlign":"center","data":{"name":"FullScreen"},"right":"2.13%","url":trans('Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile.url'),"class":"Image","propagateClick":false,"bottom":"3.42%","width":"7.814%","scaleMode":"fit_inside","backgroundOpacity":0,"verticalAlign":"middle","height":"4.618%","maxHeight":75},{"maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_16FDB4E9_070E_6C38_4191_F1C8D18930A0_mobile","horizontalAlign":"center","data":{"name":"Social Share"},"right":"24.76%","url":trans('Image_16FDB4E9_070E_6C38_4191_F1C8D18930A0_mobile.url'),"class":"Image","propagateClick":false,"bottom":"2.83%","width":"9.49%","verticalAlign":"middle","scaleMode":"fit_inside","backgroundOpacity":0,"height":"5.006%","maxHeight":75},{"backgroundColorRatios":[0,1],"minHeight":10,"minWidth":10,"id":"Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile","backgroundColor":["#333333","#333333"],"data":{"name":"Album"},"right":"0%","scrollBarMargin":1,"scrollBarColor":"#000000","overflow":"scroll","class":"Container","propagateClick":false,"top":"0%","width":"100%","gap":5,"backgroundOpacity":0.56,"children":["this.WebFrame_1601F472_0755_A069_418B_FA4531346CED_mobile","this.Image_0262E73B_0D68_0F66_41A9_E61EB52ECC69_mobile"],"visible":false,"height":"100%","scrollBarWidth":5,"layout":"absolute"},{"initialPosition":{"pitch":-0.1,"class":"PanoramaCameraPosition","yaw":177.54},"class":"PanoramaCamera","enterPointingToHorizon":true,"id":"panorama_0C3C2059_070E_6418_4197_ECE4147C7478_camera","initialSequence":"this.sequence_0C440793_070E_6CE8_419B_C4F7B89DF633"},{"click":"this.toggleVR()","maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_16F96C6E_070E_1C38_4195_0E15C66E50D4_mobile","horizontalAlign":"center","data":{"name":"VR"},"right":"11.8%","url":trans('Image_16F96C6E_070E_1C38_4195_0E15C66E50D4_mobile.url'),"class":"Image","propagateClick":false,"bottom":"2.87%","width":"11.629%","scaleMode":"fit_inside","backgroundOpacity":0,"verticalAlign":"middle","height":"6.027%","maxHeight":75},{"backgroundColorRatios":[0],"minHeight":1,"minWidth":1,"id":"WebFrame_1601F472_0755_A069_418B_FA4531346CED_mobile","backgroundColor":["#FFFFFF"],"left":"0%","right":"0%","data":{"name":"WebFrame"},"url":trans('WebFrame_1601F472_0755_A069_418B_FA4531346CED_mobile.url'),"class":"WebFrame","propagateClick":false,"top":"6.02%","height":"84.103%"},{"arrowKeysAction":"translate","class":"PanoramaPlayer","id":"MainViewer_mobilePanoramaPlayer","displayPlaybackBar":true,"keepModel3DLoadedWithoutLocation":true,"mouseControlMode":"drag_rotation","aaEnabled":true,"viewerArea":"this.MainViewer_mobile","touchControlMode":"drag_rotation"},{"click":"var visibleFunc = function(component) { this.setComponentVisibility(component, true, 0, this.effect_024BA213_0D68_0127_41AA_CBFD39DFCEAF, 'showEffect', false)}.bind(this); var invisibleFunc = function(component) { this.setComponentVisibility(component, false, 0, this.effect_024B8213_0D68_0127_4190_6EF2541E164B, 'hideEffect', false)}.bind(this); if(!this.Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile.get('visible')){ visibleFunc(this.Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile) } else { invisibleFunc(this.Container_16B8C9F4_074A_6069_4198_139C332E18B8_mobile) }; var invisibleFunc = function(component) { this.setComponentVisibility(component, false, 0, this.effect_0252E863_0FD8_3118_418E_13E18FAD968D, 'hideEffect', false)}.bind(this); invisibleFunc(this.Image_1526E375_0736_2428_4197_ACD4651C05E3_mobile); invisibleFunc(this.Image_1562EC78_070E_1C18_4177_A70F1C7A8104_mobile); invisibleFunc(this.Image_15A52807_0736_23E8_4197_B2E332E55819_mobile); invisibleFunc(this.Image_16FDB4E9_070E_6C38_4191_F1C8D18930A0_mobile); invisibleFunc(this.Image_152BBAC9_0737_E478_4189_5588737E2F4E_mobile); invisibleFunc(this.Image_152A845C_0736_6C18_419A_FCE21BA158BC_mobile); invisibleFunc(this.Image_1525F5E3_0736_2C28_416F_0582B2471858_mobile); invisibleFunc(this.Image_16F96C6E_070E_1C38_4195_0E15C66E50D4_mobile)","maxWidth":75,"minHeight":1,"minWidth":1,"id":"Image_15A52807_0736_23E8_4197_B2E332E55819_mobile","horizontalAlign":"center","left":"1.69%","data":{"name":"Gallery"},"url":trans('Image_15A52807_0736_23E8_4197_B2E332E55819_mobile.url'),"class":"Image","propagateClick":false,"bottom":"2.87%","width":"8.931%","backgroundOpacity":0,"height":"5.13%","verticalAlign":"middle","scaleMode":"fit_inside","maxHeight":75},{"initialPosition":{"pitch":0,"class":"PanoramaCameraPosition","yaw":0},"class":"PanoramaCamera","enterPointingToHorizon":true,"id":"panorama_0C3C01F6_070E_6428_4198_98AB86F49766_camera","initialSequence":"this.sequence_0C444793_070E_6CE8_4197_DB3E8F4B34E3"},{"initialPosition":{"pitch":-0.78,"class":"PanoramaCameraPosition","yaw":-0.51},"class":"PanoramaCamera","enterPointingToHorizon":true,"id":"panorama_0B95A329_070E_243B_4181_DC16F40FFAF1_camera","initialSequence":"this.sequence_0C483792_070E_6CE8_4199_49A416C497F5"},{"id":"effect_0252E863_0FD8_3118_418E_13E18FAD968D","duration":500,"class":"FadeOutEffect"},{"playbackBarProgressBackgroundColor":["#3399FF"],"progressLeft":"33%","playbackBarHeadShadowOpacity":0.7,"playbackBarProgressBackgroundColorRatios":[0],"vrPointerSelectionColor":"#FF6600","playbackBarBorderColor":"#FFFFFF","subtitlesTextShadowVerticalLength":1,"data":{"name":"Main Viewer"},"toolTipShadowColor":"#333138","toolTipTextShadowColor":"#000000","playbackBarProgressBorderColor":"#000000","toolTipPaddingRight":3,"playbackBarBorderRadius":0,"subtitlesGap":0,"playbackBarHeadBorderRadius":0,"surfaceReticleColor":"#FFFFFF","playbackBarBackgroundOpacity":1,"subtitlesBackgroundColor":"#000000","playbackBarHeadBorderColor":"#000000","propagateClick":false,"toolTipPaddingLeft":3,"vrPointerSelectionTime":2000,"vrPointerColor":"#FFFFFF","toolTipBorderColor":"#767676","subtitlesTextShadowOpacity":1,"toolTipBackgroundColor":"#F6F6F6","subtitlesFontColor":"#FFFFFF","progressBackgroundColorRatios":[0],"subtitlesTop":0,"toolTipTextShadowBlurRadius":1,"playbackBarBorderSize":0,"firstTransitionDuration":0,"subtitlesTextShadowColor":"#000000","progressRight":"33%","playbackBarHeadShadowBlurRadius":1.5,"subtitlesFontSize":"3vmin","progressOpacity":0.7,"progressBarBorderColor":"#000000","progressBarBackgroundColorDirection":"horizontal","progressBarBackgroundColorRatios":[0],"vrThumbstickRotationStep":20,"playbackBarHeadHeight":15,"minHeight":25,"playbackBarLeft":0,"playbackBarHeadShadowColor":"#000000","subtitlesBackgroundOpacity":0.2,"minWidth":50,"playbackBarHeadShadow":true,"id":"MainViewer_mobile","playbackBarHeadBackgroundColorRatios":[0,1],"playbackBarHeadBorderSize":0,"progressBorderColor":"#000000","toolTipFontColor":"#606060","progressBarBackgroundColor":["#3399FF"],"subtitlesBorderColor":"#FFFFFF","subtitlesBottom":50,"playbackBarHeadBackgroundColor":["#111111","#666666"],"progressBackgroundColor":["#000000"],"surfaceReticleSelectionColor":"#FFFFFF","toolTipFontFamily":"Arial","class":"ViewerArea","playbackBarBottom":5,"toolTipFontSize":"1.11vmin","progressHeight":2,"toolTipShadowBlurRadius":1,"progressBottom":10,"progressBarBorderRadius":2,"progressBorderSize":0,"width":"100%","subtitlesTextShadowHorizontalLength":1,"playbackBarHeight":10,"progressBarBorderSize":0,"playbackBarBackgroundColor":["#FFFFFF"],"playbackBarProgressBorderSize":0,"height":"100%","playbackBarHeadWidth":6,"playbackBarBackgroundColorDirection":"vertical","playbackBarRight":0,"toolTipBorderRadius":1,"playbackBarProgressBorderRadius":0,"subtitlesFontFamily":"Arial","progressBorderRadius":2},{"minHeight":1,"minWidth":1,"id":"Image_1525F5E3_0736_2C28_416F_0582B2471858_mobile","horizontalAlign":"center","left":"34.64%","data":{"name":"FloorPlan"},"url":trans('Image_1525F5E3_0736_2C28_416F_0582B2471858_mobile.url'),"class":"Image","propagateClick":false,"bottom":"3.29%","width":"8.611%","verticalAlign":"middle","backgroundOpacity":0,"height":"4.618%","scaleMode":"fit_inside"},{"minHeight":1,"minWidth":1,"id":"Image_152A845C_0736_6C18_419A_FCE21BA158BC_mobile","horizontalAlign":"center","left":"44.01%","data":{"name":"Map"},"url":trans('Image_152A845C_0736_6C18_419A_FCE21BA158BC_mobile.url'),"class":"Image","propagateClick":false,"bottom":"3.25%","width":"9.687%","verticalAlign":"middle","backgroundOpacity":0,"height":"5.13%","scaleMode":"fit_inside"},{"data":{"label":"Circle 03b","hasPanoramaAction":true},"class":"HotspotPanoramaOverlay","maps":[],"items":[{"distance":100,"class":"HotspotPanoramaOverlayImage","image":"this.AnimatedImageResource_51C4BCA9_40E1_672F_41B5_910BCFDE403D","roll":-2.87,"pitch":-23.5,"yaw":163.46,"data":{"label":"Circle 03b"},"scaleMode":"fit_inside","rotationX":-4.51,"hfov":19.14,"rotationY":-2.05,"vfov":10.26}],"useHandCursor":true,"id":"overlay_08657AB2_0716_6428_4192_E275D79F91BC","enabledInCardboard":true,"areas":["this.HotspotPanoramaOverlayArea_08652AB2_0716_6428_4172_6B26653CEAA3"]},{"data":{"label":"Circle 03b","hasPanoramaAction":true},"class":"HotspotPanoramaOverlay","maps":[],"items":[{"pitch":-16.01,"distance":100,"roll":-1.88,"class":"HotspotPanoramaOverlayImage","data":{"label":"Circle 03b"},"scaleMode":"fit_inside","yaw":77.06,"rotationX":-32.93,"hfov":13.74,"image":"this.AnimatedImageResource_51C46CA9_40E1_672F_4193_40D183218BD0","vfov":12.59}],"useHandCursor":true,"id":"overlay_086FB2C6_0712_2468_418A_C29910B08BB9","enabledInCardboard":true,"areas":["this.HotspotPanoramaOverlayArea_086892C6_0712_2468_4194_8AB247FE25BE"]},{"data":{"label":"Circle 03b","hasPanoramaAction":true},"class":"HotspotPanoramaOverlay","maps":[],"items":[{"pitch":-16.9,"distance":100,"class":"HotspotPanoramaOverlayImage","data":{"label":"Circle 03b"},"scaleMode":"fit_inside","yaw":72.08,"rotationX":43.73,"hfov":15.07,"rotationY":9.69,"image":"this.AnimatedImageResource_51C4CCA9_40E1_672F_418D_BB250E02246B","vfov":10.9}],"useHandCursor":true,"id":"overlay_169E6912_070E_25E8_4190_057C1B979F45","enabledInCardboard":true,"areas":["this.HotspotPanoramaOverlayArea_169E5912_070E_25E8_418D_1928FFB29ED4"]},{"data":{"label":"Circle 03b","hasPanoramaAction":true},"class":"HotspotPanoramaOverlay","maps":[],"items":[{"pitch":-20.63,"distance":100,"roll":-0.55,"class":"HotspotPanoramaOverlayImage","data":{"label":"Circle 03b"},"scaleMode":"fit_inside","yaw":-90.7,"rotationX":-29.6,"hfov":19.03,"image":"this.AnimatedImageResource_51C48CA9_40E1_672F_41C7_AA2A3900A882","vfov":11.5}],"useHandCursor":true,"id":"overlay_08BAA50E_071E_2DF8_417B_4A69ECFD72B4","enabledInCardboard":true,"areas":["this.HotspotPanoramaOverlayArea_08BB850E_071E_2DF8_4180_1F67A7D43C5A"]},{"id":"sequence_0C440793_070E_6CE8_419B_C4F7B89DF633","class":"PanoramaCameraSequence","movements":[{"easing":"cubic_in","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"yawDelta":323,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"easing":"cubic_out","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"}]},{"id":"sequence_0C444793_070E_6CE8_4197_DB3E8F4B34E3","class":"PanoramaCameraSequence","movements":[{"easing":"cubic_in","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"yawDelta":323,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"easing":"cubic_out","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"}]},{"id":"sequence_0C483792_070E_6CE8_4199_49A416C497F5","class":"PanoramaCameraSequence","movements":[{"easing":"cubic_in","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"yawDelta":323,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"},{"easing":"cubic_out","yawDelta":18.5,"yawSpeed":7.96,"class":"DistancePanoramaCameraMovement"}]},{"rowCount":6,"finalFrame":"first","frameDuration":41,"class":"AnimatedImageResource","id":"AnimatedImageResource_51C4BCA9_40E1_672F_41B5_910BCFDE403D","colCount":4,"levels":[{"height":660,"url":"media/res_174DCEBE_071E_1C18_418E_329F0771BD3F_0.webp","class":"ImageResourceLevel","width":1080}],"frameCount":24},{"displayTooltipInTouchScreens":true,"click":"this.setPlayListSelectedIndex(this.mainPlayList, 1)","class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_08652AB2_0716_6428_4172_6B26653CEAA3","mapColor":"any"},{"rowCount":6,"finalFrame":"first","frameDuration":41,"class":"AnimatedImageResource","id":"AnimatedImageResource_51C46CA9_40E1_672F_4193_40D183218BD0","colCount":4,"levels":[{"height":660,"url":"media/res_174DCEBE_071E_1C18_418E_329F0771BD3F_0.webp","class":"ImageResourceLevel","width":1080}],"frameCount":24},{"displayTooltipInTouchScreens":true,"click":"this.setPlayListSelectedIndex(this.mainPlayList, 0)","class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_086892C6_0712_2468_4194_8AB247FE25BE","mapColor":"any"},{"rowCount":6,"finalFrame":"first","frameDuration":41,"class":"AnimatedImageResource","id":"AnimatedImageResource_51C4CCA9_40E1_672F_418D_BB250E02246B","colCount":4,"levels":[{"height":660,"url":"media/res_174DCEBE_071E_1C18_418E_329F0771BD3F_0.webp","class":"ImageResourceLevel","width":1080}],"frameCount":24},{"displayTooltipInTouchScreens":true,"click":"this.setPlayListSelectedIndex(this.mainPlayList, 2)","class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_169E5912_070E_25E8_418D_1928FFB29ED4","mapColor":"any"},{"rowCount":6,"finalFrame":"first","frameDuration":41,"class":"AnimatedImageResource","id":"AnimatedImageResource_51C48CA9_40E1_672F_41C7_AA2A3900A882","colCount":4,"levels":[{"height":660,"url":"media/res_174DCEBE_071E_1C18_418E_329F0771BD3F_0.webp","class":"ImageResourceLevel","width":1080}],"frameCount":24},{"displayTooltipInTouchScreens":true,"click":"this.setPlayListSelectedIndex(this.mainPlayList, 2)","class":"HotspotPanoramaOverlayArea","id":"HotspotPanoramaOverlayArea_08BB850E_071E_2DF8_4180_1F67A7D43C5A","mapColor":"any"}]};
if (script['data'] == undefined)
    script['data'] = {};
script['data']['translateObjs'] = translateObjs, script['data']['createQuizConfig'] = function () {
    var a = {};
    return this['get']('data')['translateObjs'] = translateObjs, a;
}, TDV['PlayerAPI']['defineScript'](script);
//# sourceMappingURL=script_device.js.map
})();
//Generated with v2025.2.10, Sun Dec 21 2025