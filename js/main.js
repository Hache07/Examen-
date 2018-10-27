var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} // Utility
var utils = function () {
  function dom(selector) {
    if (selector[0] === '#') {
      return document.getElementById(selector.slice(1));
    }
    return document.querySelectorAll(selector);
  }

  function copyJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isTouchDevice() {
    return navigator.userAgent.
    match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
  }

  function getWorkerURLFromElement(selector) {
    var element = dom(selector);
    var content = babel.transform(element.innerText).code;
    var blob = new Blob([content], { type: 'text/javascript' });
    return URL.createObjectURL(blob);
  }

  var cursorManager = function () {
    var cursorManager = {};

    var voidNodeTags = [
    'AREA', 'BASE', 'BR', 'COL', 'EMBED',
    'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK',
    'MENUITEM', 'META', 'PARAM', 'SOURCE',
    'TRACK', 'WBR', 'BASEFONT', 'BGSOUND',
    'FRAME', 'ISINDEX'];


    Array.prototype.contains = function (obj) {
      var i = this.length;
      while (i--) {
        if (this[i] === obj) {
          return true;
        }
      }
      return false;
    };

    function canContainText(node) {
      if (node.nodeType == 1) {
        return !voidNodeTags.contains(node.nodeName);
      } else {
        return false;
      }
    };

    function getLastChildElement(el) {
      var lc = el.lastChild;
      while (lc && lc.nodeType != 1) {
        if (lc.previousSibling)
        lc = lc.previousSibling;else

        break;
      }
      return lc;
    }
    cursorManager.setEndOfContenteditable = function (contentEditableElement) {

      while (getLastChildElement(contentEditableElement) &&
      canContainText(getLastChildElement(contentEditableElement))) {
        contentEditableElement = getLastChildElement(contentEditableElement);
      }

      var range, selection;
      if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } else
      if (document.selection)
      {
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
      }
    };

    return cursorManager;
  }();

  return {
    copyJSON: copyJSON, cursorManager: cursorManager, dom: dom,
    getWorkerURLFromElement: getWorkerURLFromElement, isTouchDevice: isTouchDevice };

}();


// API Adapter
var SudokuAdapter = function () {
  function SudokuAdapter(url) {_classCallCheck(this, SudokuAdapter);
    this.worker = new Worker(url);
    return this;
  }_createClass(SudokuAdapter, [{ key: '_postMessage', value: function _postMessage(

    options) {var _this = this;
      this.worker.postMessage(JSON.stringify(options));
      return new Promise(function (resolve, reject) {
        _this.worker.onmessage = function (event) {
          resolve(event.data);
        };
      });
    } }, { key: 'generate', value: function generate(

    options) {
      options = Object.assign(
      {}, options, { method: 'generate' });

      return this._postMessage(options);
    } }, { key: 'validate', value: function validate(

    options) {
      options = Object.assign(
      {}, options, { method: 'validate' });

      return this._postMessage(options);
    } }]);return SudokuAdapter;}();



// Client Side Settings
var SUDOKU_APP_CONFIG = {
  HINTS: 34,
  TRY_LIMIT: 100000,
  WORKER_URL: utils.getWorkerURLFromElement('#worker'),
  DOM_TARGET: utils.dom('#sudoku-app')



  // Client Side
};var SudokuApp = function (config) {var

  HINTS =

  config.HINTS,TRY_LIMIT = config.TRY_LIMIT,WORKER_URL = config.WORKER_URL,DOM_TARGET = config.DOM_TARGET;

  var sudokuAdapter = new SudokuAdapter(WORKER_URL);

  var state = {
    success: null,
    board: null,
    solution: null,
    solved: null,
    errors: [] };

  Object.observe(state, render);

  var history = [state];
  var historyStash = [];


  // Event listeners
  var onClickGenerate = initialize;

  var onClickSolve = function onClickSolve() {
    setState({
      board: state.solution,
      solved: true,
      errors: [] });

  };

  var onKeyUpCell = function onKeyUpCell(event) {
    var key = event.keyCode;
    if ( // a
    key === 36 || // r
    key === 37 || // r
    key === 38 || // o
    key === 39 || // w
    key === 9 || // tab
    // mod key flags are always false in keyup event
    // keyIdentifier doesn't seem to be implemented
    // in all browsers
    key === 17 || // Control
    key === 16 || // Shift
    key === 91 || // Meta
    key === 19 || // Alt
    event.keyIdentifier === 'Control' ||
    event.keyIdentifier === 'Shift' ||
    event.keyIdentifier === 'Meta' ||
    event.keyIdentifier === 'Alt')
    return;

    var cell = event.target;
    var value = cell.innerText;

    if (value.length > 4) {
      cell.innerText = value.slice(0, 4);
      return false;
    }

    var cellIndex = cell.getAttribute('data-cell-index');
    cellIndex = parseInt(cellIndex, 10);
    var rowIndex = Math.floor(cellIndex / 9);
    var cellIndexInRow = cellIndex - rowIndex * 9;

    var board = Object.assign([], state.board);
    board[rowIndex].splice(cellIndexInRow, 1, value);

    validate(board).then(function (errors) {
      historyStash = [];
      history.push({});
      var solved = null;
      if (errors.indexOf(true) === -1) {
        solved = true;
        board.forEach(function (row) {
          row.forEach(function (value) {
            if (!value || !parseInt(value, 10) || value.length > 1) {
              solved = false;
            }
          });
        });
      }
      if (solved) {
        board = Object.assign([], board).map(function (row) {return row.map(function (n) {return +n;});});
      }
      setState({ board: board, errors: errors, solved: solved }, function (newState) {
        history[history.length - 1] = newState;
        restoreCaretPosition(cellIndex);
      });
    });
  };

  function keyDown(event) {
    var keys = {
      ctrlOrCmd: event.ctrlKey || event.metaKey,
      shift: event.shiftKey,
      z: event.keyCode === 90 };


    if (keys.ctrlOrCmd && keys.z) {
      if (keys.shift && historyStash.length) {
        redo();
      } else if (!keys.shift && history.length > 1) {
        undo();
      }
    }
  }

  function undo() {
    historyStash.push(history.pop());
    setState(utils.copyJSON(history[history.length - 1]));
  }

  function redo() {
    history.push(historyStash.pop());
    setState(utils.copyJSON(history[history.length - 1]));
  }


  function initialize() {
    unbindEvents();
    render();
    getSudoku().then(function (sudoku) {
      setState({
        success: sudoku.success,
        board: sudoku.board,
        solution: sudoku.solution,
        errors: [],
        solved: false },
      function (newState) {
        history = [newState];
        historyStash = [];
      });
    });
  }

  function setState(newState, callback) {
    requestAnimationFrame(function () {
      Object.assign(state, newState);
      if (typeof callback === 'function') {
        var param = utils.copyJSON(state);
        requestAnimationFrame(callback.bind(null, param));
      }
    });
  }

  function bindEvents() {
    var generateButton = utils.dom('#generate-button');
    var solveButton = utils.dom('#solve-button');
    var undoButton = utils.dom('#undo-button');
    var redoButton = utils.dom('#redo-button');
    generateButton &&
    generateButton.
    addEventListener('click', onClickGenerate);
    solveButton &&
    solveButton.
    addEventListener('click', onClickSolve);
    undoButton &&
    undoButton.
    addEventListener('click', undo);
    redoButton &&
    redoButton.
    addEventListener('click', redo);

    var cells = utils.dom('.sudoku__table-cell');
    [].forEach.call(cells, function (cell) {
      cell.addEventListener('keyup', onKeyUpCell);
    });

    window.addEventListener('keydown', keyDown);
  }

  function unbindEvents() {
    var generateButton = utils.dom('#generate-button');
    var solveButton = utils.dom('#solve-button');
    var undoButton = utils.dom('#undo-button');
    var redoButton = utils.dom('#redo-button');
    generateButton &&
    generateButton.
    removeEventListener('click', onClickGenerate);
    solveButton &&
    solveButton.
    removeEventListener('click', onClickSolve);
    undoButton &&
    undoButton.
    removeEventListener('click', undo);
    redoButton &&
    redoButton.
    removeEventListener('click', redo);

    var cells = utils.dom('.sudoku__table-cell');
    [].forEach.call(cells, function (cell) {
      cell.removeEventListener('keyup', onKeyUpCell);
    });

    window.removeEventListener('keydown', keyDown);
  }

  function restoreCaretPosition(cellIndex) {
    utils.cursorManager.setEndOfContenteditable(
    utils.dom('[data-cell-index="' + cellIndex + '"]')[0]);

  }

  function getSudoku() {
    return sudokuAdapter.generate({
      hints: HINTS,
      limit: TRY_LIMIT });

  }

  function validate(board) {
    var map = board.reduce(function (memo, row) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
        for (var _iterator = row[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var num = _step.value;
          memo.push(num);
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
      return memo;
    }, []).map(function (num) {return parseInt(num, 10);});

    var validations = [];

    // Will validate one by one
    var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {var _loop = function _loop() {var _step2$value = _slicedToArray(_step2.value, 2),index = _step2$value[0],number = _step2$value[1];
        if (!number) {
          validations.push(
          new Promise(function (res) {
            res({ result: { box: -1, col: -1, row: -1 } });
          }));

        } else {
          var all = Promise.all(validations);
          validations.push(all.then(function () {
            return sudokuAdapter.validate({ map: map, number: number, index: index });
          }));
        }};for (var _iterator2 = map.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {_loop();
      }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}

    return Promise.all(validations).
    then(function (values) {
      var errors = [];var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
        for (var _iterator3 = values.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _step3$value = _slicedToArray(_step3.value, 2),index = _step3$value[0],validation = _step3$value[1];var _validation$result =
          validation.result,box = _validation$result.box,col = _validation$result.col,row = _validation$result.row;
          var errorInBox = box.first !== box.last;
          var errorInCol = col.first !== col.last;
          var errorInRow = row.first !== row.last;

          var indexOfRow = Math.floor(index / 9);
          var indexInRow = index - indexOfRow * 9;

          errors[index] = errorInRow || errorInCol || errorInBox;
        }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}

      return errors;
    });
  }

  function render() {
    unbindEvents();

    DOM_TARGET.innerHTML = '\n      <div class=\'sudoku\'>\n        ' +

    headerComponent() + '\n        ' +
    contentComponent() + '\n      </div>\n    ';



    bindEvents();
  }

  function buttonComponent(props) {var
    id = props.id,text = props.text,mods = props.mods,classes = props.classes;

    var blockName = 'button';
    var modifiers = {};
    var modType = toString.call(mods);
    if (modType === '[object String]') {
      modifiers[mods] = true;

    } else if (modType === '[object Array]') {var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {
        for (var _iterator4 = mods[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var modName = _step4.value;
          modifiers[modName] = true;
        }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
    }

    var blockClasses = bem.makeClassName({
      block: blockName,
      modifiers: modifiers });


    var buttonTextClass = blockName + '-text';
    if (Object.keys(modifiers).length) {
      buttonTextClass +=
      Object.keys(modifiers).reduce(function (memo, curr) {
        return memo + (' ' + blockName + '--' + curr + '-text');
      }, '');

    }

    var lgText = typeof text === 'string' ?
    text : text[0];
    var mdText = typeof text === 'string' ?
    text : text[1];
    var smText = typeof text === 'string' ?
    text : text[2];

    return '\n      <button\n        id=\'' +

    id + '\'\n        class=\'' +
    blockClasses + ' ' + (classes || "") + '\'>\n        <span class=\'show-on-sm ' +
    buttonTextClass + '\'>\n          ' +
    smText + '\n        </span>\n        <span class=\'show-on-md ' +

    buttonTextClass + '\'>\n          ' +
    mdText + '\n        </span>\n        <span class=\'show-on-lg ' +

    buttonTextClass + '\'>\n          ' +
    lgText + '\n        </span>\n      </button>\n    ';



  }

  function messageComponent(options) {var
    state = options.state,content = options.content;

    var messageClass = bem.makeClassName({
      block: 'message',
      modifiers: state ? _defineProperty({},
      state, true) :
      {} });


    return '\n      <p class=\'' +
    messageClass + '\'>\n        ' +
    content + '\n      </p>\n    ';


  }

  function descriptionComponent(options) {var
    className = options.className,infoLevel = options.infoLevel;

    var technical = '\n      In this demo,\n      <a href=\'https://en.wikipedia.org/wiki/Backtracking\'>\n        backtracking algorithm\n      </a> is used for <em>generating</em>\n      the sudoku.';






    var description = '\n      Difficulty and solvability is\n      totally random as I randomly left a certain number of hints\n      from a full-filled board.\n    ';





    if (infoLevel === 'full') {
      return '\n        <p class=\'' + (
      className || '') + '\'>\n          ' +
      technical + ' ' + description + '\n        </p>\n      ';



    } else if (infoLevel === 'mini') {
      return '\n        <p class=\'' + (
      className || '') + '\'>\n          ' +
      description + '\n        </p>\n      ';


    }
  }

  function restoreScrollPosComponent() {
    return '<div style=\'height: 540px\'></div>';
  }

  function headerComponent() {
    return '\n      <div class=\'sudoku__header\'>\n\n        <h1 class=\'sudoku__title\'>\n\n          <span class=\'show-on-sm\'>\n            Sudoku\n          </span>\n\n          <span class=\'show-on-md\'>\n            Sudoku Puzzle\n          </span>\n\n          <span class=\'show-on-lg\'>\n            Javascript Sudoku Puzzle Generator\n          </span>\n\n        </h1>\n\n        ' +


















    descriptionComponent({
      infoLevel: 'mini',
      className: 'sudoku__description show-on-md' }) + '\n\n        ' +


    descriptionComponent({
      infoLevel: 'full',
      className: 'sudoku__description show-on-lg' }) + '\n\n        ' + (



    state.success ? '\n    \n              ' +

    buttonComponent({
      id: 'generate-button',
      text: ['New Board', 'New Board', 'New'],
      mods: 'primary' }) + '\n    \n              ' + (


    state.solved ?
    buttonComponent({
      id: 'solve-button',
      text: 'Solved',
      mods: ['tertiary', 'muted'] }) :

    buttonComponent({
      id: 'solve-button',
      text: 'Solve',
      mods: 'secondary' })) + '\n\n            ' : '\n    \n              ' +







    buttonComponent({
      id: 'generate-button',
      text: ['Generating', '', ''],
      mods: ['disabled', 'loading'] }) + '\n    \n              ' +


    buttonComponent({
      id: 'solve-button',
      text: 'Solve',
      mods: 'disabled' }) + '\n            ') + '\n\n        ' + (





    utils.isTouchDevice() ? '\n\n          ' +

    buttonComponent({
      id: 'redo-button',
      text: ['&raquo;', '&raquo;', '&gt;', '&gt;'],
      classes: 'fr',
      mods: [
      'neutral',
      'compound',
      'compound-last', '' + (
      !historyStash.length ?
      'disabled' :
      '')] }) + '\n          ' +



    buttonComponent({
      id: 'undo-button',
      text: ['&laquo;', '&laquo;', '&lt;', '&lt;'],
      classes: 'fr',
      mods: [
      'neutral',
      'compound',
      'compound-first', '' + (
      history.length > 1 ?
      '' :
      'disabled')] }) + '\n\n      ' :




    '') + '\n\n      </div>\n    ';



  }

  function contentComponent() {
    var _isSeparator = function _isSeparator(index) {return (
        !!index && !((index + 1) % 3));};

    var resultReady = !!state.board;
    var fail = resultReady && !state.success;

    if (!resultReady) {
      return '\n        ' +
      messageComponent({
        state: 'busy',
        content: 'Generating new board...' }) + '\n        ' +

      restoreScrollPosComponent() + '\n      ';

    }

    if (fail) {
      return '\n        ' +
      messageComponent({
        state: 'fail',
        content: 'Something went wrong with this board, try generating another one.' }) + '\n        ' +

      restoreScrollPosComponent() + '\n      ';

    }

    var rows = state.board;

    return '\n      <table class=\'sudoku__table\'>\n\n        ' +


    rows.map(function (row, index) {
      var className = bem.makeClassName({
        block: 'sudoku',
        element: 'table-row',
        modifiers: {
          separator: _isSeparator(index) } });



      return '<tr class=\'' +
      className + '\'>\n\n              ' +

      row.map(function (num, _index) {
        var cellIndex = index * 9 + _index;
        var separator = _isSeparator(_index);
        var editable = typeof num !== 'number';
        var error = state.errors[cellIndex];
        var className = bem.makeClassName({
          block: 'sudoku',
          element: 'table-cell',
          modifiers: {
            separator: separator,
            editable: editable,
            error: error,
            'editable-error': editable && error } });



        return '\n\t\n                  <td class=\'' +

        className + '\'\n                      data-cell-index=\'' +
        cellIndex + '\'\n                      ' + (
        editable ? 'contenteditable' : '') + '>\n                        ' +
        num + '\n                  </td>';


      }).join('') + '\n\n            \n</tr>\n';




    }).join('') + '\n\n      </table>\n    ';



  }

  return { initialize: initialize };

}(SUDOKU_APP_CONFIG).initialize();




var img='img/1.jpg' ;
var turno=1;
var arreglo = new Array();
var jug1=0;
var jug2=0;

for(i=0; i<=8; i++) {
  arreglo[i]=-1;
}

function box(pos) {

  if(arreglo[pos]==-1) {
    if(turno==1) {
      if(img=='img/1.jpg') {
        document.getElementById('c'+pos).src=img;
        arreglo[pos]=1;
        turno=2;
        img='img/2o.png';
      }
    } else if(turno==2) { 
            if(img=='img/2o.png') {
              document.getElementById('c'+pos).src=img;
              arreglo[pos]=0;
              turno=1;
              img='img/1.jpg' ;
            }
          }
  } else { 
      alert('Posicion ocupada!'); 
    }
    
  if(arreglo[0]==1 && arreglo[1]==1 && arreglo[2]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[1]==0 && arreglo[2]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[3]==1 && arreglo[4]==1 && arreglo[5]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[3]==0 && arreglo[4]==0 && arreglo[5]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[6]==1 && arreglo[7]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[6]==0 && arreglo[7]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[0]==1 && arreglo[3]==1 && arreglo[6]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[3]==0 && arreglo[6]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[1]==1 && arreglo[4]==1 && arreglo[7]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[1]==0 && arreglo[4]==0 && arreglo[7]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[2]==1 && arreglo[5]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[2]==0 && arreglo[5]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[0]==1 && arreglo[4]==1 && arreglo[8]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[0]==0 && arreglo[4]==0 && arreglo[8]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }

  if(arreglo[2]==1 && arreglo[4]==1 && arreglo[6]==1) {
    alert('GANADOR JUGADOR 1');
    jug1=jug1+1;
    reiniciar();
  }

  if(arreglo[2]==0 && arreglo[4]==0 && arreglo[6]==0) {
    alert('GANADOR JUGADOR 2');
    jug2=jug2+1;
    reiniciar();
  }
}

function reiniciar() {
  document.getElementById('reset');

  for(i=0; i<=8; i++){
    document.getElementById('c'+i).src="img/fondo1.jpg";
  }

  for(i=0; i<=8; i++){
    arreglo[i]=-1;
  }
}