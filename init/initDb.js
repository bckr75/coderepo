use coderepo
db.users.insertMany([
	{id: NumberInt(1), username: "firstUser", password: "$2y$10$Tj2mVKNDUrpRjt2l7cLEtOLqSCM.RJPYVUiHOFSEwPRQiVbCTb7t2", authKey: "test1Key", accessToken: "1-token"},
	{id: NumberInt(2), username: "secondUser", password: "$2y$10$YMlyW6ibsrmBK45AxLBiL.23BYGk58My1ByqXSpSsefaOb3cnkTCS", authKey: "test2key", accessToken: "2-token" }
	])
db.users.createIndex({"id": 1}, {unique: true})
db.users.createIndex({"username": 1}, {unique: true})
db.snippets.insertMany([{
		"id": NumberInt(1), 
		"userId": NumberInt(1), 
		"private": "true", 
		"snippet": "<?php\r\n\r\n\r\nnamespace App\\Messaging;\r\n\r\nuse App\\Tools\\Bag;\r\n\r\nabstract class BaseMailer\r\n{\r\n    protected $_params;\r\n    protected $_username;\r\n    protected $_password;\r\n\r\n    function __construct(Bag $params) {\r\n        $this->_params = $params ?? new Bag();\r\n        if(!$this->_params->get('username') || !$this->_params->get('password')) {\r\n            throw new \\Exception('Username or password not set');\r\n        }\r\n        $this->_username = $this->_params->get('username');\r\n        $this->_password = $this->_params->get('password');\r\n    }\r\n}", 
		"type": "php"
	},{
		"id": NumberInt(2), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "class Static {\r\n    static foreach(object, callback) {\r\n        Static.typeCheck(object, 'Argument \"object\"', 'object');\r\n        Static.typeCheck(callback, 'Argument \"callback\"', 'function');\r\n        if (!callback.length || callback.length === 1) {\r\n            if (Object.prototype.toString.call(object) === '[object Array]' ||\r\n                Object.prototype.toString.call(object) === '[object NodeList]') {\r\n                for (let i = 0, objClone = Array.from(object); i < objClone.length; i++) {\r\n                    callback(objClone[i]);\r\n                }\r\n            } else if (Object.prototype.toString.call(object) === '[object Object]') {\r\n                for (let i = 0, objClone = Object.keys(object); i < objClone.length; i++) {\r\n                    callback(object[objClone[i]]);\r\n                }\r\n            } else {\r\n                throw new TypeError('Argument \"object\" must be array of objects or nodelist or object');\r\n            }\r\n            return false;\r\n        }\r\n        for (let i = 0, objClone = Object.keys(object); i < objClone.length; i++) {\r\n            callback(objClone[i], object[objClone[i]]);\r\n        }\r\n    }\r\n}", 
		"type": "javascript"
	},{ 
		"id": NumberInt(3), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "SELECT c.*, to_char(\"date\", 'DD.MM.YYYY') date_t  FROM\r\n  (SELECT DISTINCT ON (search) *  FROM \"fake\" ORDER BY search, id, type ASC) c\r\nWHERE \"date\" >= to_timestamp(1489957620)\r\nORDER BY date_t DESC\r\nLIMIT 14", 
		"type": "sql" 
	},{ 
		"id": NumberInt(4), 
		"userId": NumberInt(1), 
		"private": "true", 
		"snippet": "class Static {\n    static scrollTo(element, speed = 500) {\n        if (Static.typeCheck(element, 'object', 'object', true)) {\n            if (element.offsetParent) {\n                let elementOffset = 0, clone = element;\n                do {\n                    elementOffset += clone.offsetTop;\n                } while (clone = clone.offsetParent);\n                let offset = elementOffset - window.pageYOffset;\n                offset = offset <= 0 ? offset : offset + element.scrollHeight;\n                for (let i = 0, length = (offset) / speed; i < speed; i++) {\n                    setTimeout(window.scrollBy, i, 0, length);\n                }\n            }\n        }\n    }\n}", 
		"type": "javascript" 
	},{
		"id": NumberInt(5), 
		"userId": NumberInt(1), 
		"private": "true", 
		"snippet": "<?php\r\n\r\n\r\nnamespace History\\Messaging;\r\n\r\nuse History\\Tools\\Bag;\r\nuse iqsms_json;\r\n\r\nclass Dispatcher\r\n{\r\n    const EMAIL = 1;\r\n    const SMS = 2;\r\n\r\n    private static $_types = [\r\n        self::EMAIL => [\r\n            'class' => EMailer::class,\r\n            'config' => 'mail'\r\n        ],\r\n        self::SMS => [\r\n            'class' => SMSMailer::class,\r\n            'config' => 'sms'\r\n        ]\r\n    ];\r\n\r\n    /** @var $_senders EMailer[]|iqsms_json[] */\r\n    private $_senders;\r\n\r\n    function __construct(Bag $params, array $typeMessages) {\r\n        $this->_params = $params;\r\n        if(!is_array($typeMessages)) {\r\n            throw new \\Exception('Argument $typeMessages must be of type array, '.gettype($typeMessages).' given');\r\n        }\r\n        $this->_messages = $typeMessages;\r\n        foreach (self::$_types as $type => $typeArr) {\r\n            if(isset($this->_messages[$type])) {\r\n                $this->_senders[$type] = new $typeArr['class']($this->_params->get($typeArr['config'], true));\r\n            }\r\n        }\r\n    }\r\n\r\n    public function send() {\r\n        array_walk($this->_messages, function (&$arguments, $index) {\r\n            try {\r\n                if(!is_array($arguments)) {\r\n                    throw new \\Exception('$this->_messages[] must be of type array, '.gettype($arguments).' given');\r\n                }\r\n                $arguments = call_user_func_array([$this->_senders[$index], 'send'], $arguments);\r\n            } catch (\\Exception $e) {\r\n                (new EMailer($this->_params->get('mail', true)))\r\n                    ->sendErrorMessage(sprintf('Класс: %s, Ошибка: %s',\r\n                        get_class($this->_senders[$index]), $e->getMessage()));\r\n                $arguments = $this->_params->get('global.debug') ? $e->getMessage() : false;\r\n            }\r\n        });\r\n        return $this->_messages;\r\n    }\r\n\r\n    public function sendFromUser() {\r\n        array_walk($this->_messages, function (&$arguments, $index) {\r\n            try {\r\n                if(!is_array($arguments)) {\r\n                    throw new \\Exception('$this->_messages[] must be of type array, '.gettype($arguments).' given');\r\n                }\r\n                $arguments = call_user_func_array([$this->_senders[$index], 'sendFromUser'], $arguments);\r\n            } catch (\\Exception $e) {\r\n                (new EMailer($this->_params->get('mail', true)))\r\n                    ->sendErrorMessage(sprintf('Класс: %s, Ошибка: %s',\r\n                        get_class($this->_senders[$index]), $e->getMessage()));\r\n                $arguments = $this->_params->get('global.debug') ? $e->getMessage() : false;\r\n            }\r\n        });\r\n        return $this->_messages;\r\n    }\r\n}", 
		"type": "php" 
	},{
		"id": NumberInt(6), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "export class Buttons extends Base {\r\n    constructor(array) {\r\n        super(array, 'buttons');\r\n    }\r\n\r\n    init() {\r\n        super.init((_this) => {\r\n            Static.typeCheck(_this, 'Buttons{}', 'object');\r\n            Static.typeCheck(_this.buttons, 'Buttons{}.buttons', 'object');\r\n            Static.typeCheck(_this.buttons.items, 'Buttons{}.buttons.items', 'object');\r\n            _this.buttons.items.forEach((button) => {\r\n                button.addEventListener('click', (event) => {\r\n                    Base.toggleClass(button, _this.buttons.class, _this.buttons.callback, event);\r\n                    if (Static.typeCheck(_this.boundElements, 'Buttons{}.boundElements', 'object', true) &&\r\n                        Static.typeCheck(_this.boundElements.items, 'Buttons{}.boundElements.items', 'object', true)) {\r\n                        _this.boundElements.items.forEach((boundElement) => {\r\n                            Base.toggleClass(boundElement, _this.boundElements.class, _this.boundElements.callback, event);\r\n                        })\r\n                    }\r\n                })\r\n            });\r\n            if(Static.typeCheck(_this.label, 'Buttons{}.label', 'string', true)) {\r\n                LABELS.buttons[_this.label] = _this;\r\n                delete(LABELS.buttons[_this.label].label);\r\n            }\r\n        });\r\n        if(window.DEBUG === true) {\r\n            window.Buttons = this;\r\n        }\r\n    }\r\n}", 
		"type": "javascript" 
	},{
		"id": NumberInt(7), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction removeDuplicates($array, $fields) {\n    if (!is_array($array) || !is_array($fields) || empty($fields)) {\n        return $array;\n    }\n    if($parameter = self::findArgumentInArray($fields, 'date')) {\n        usort($array, function($a, $b) use($parameter) {\n            return strtotime($b[$parameter]) - strtotime($a[$parameter]);\n        });\n    }\n    $res = [];\n    foreach ($array as $key => $value) {\n        $duplicate = false;\n        foreach ($res as $resItem) {\n            $count = 0;\n            foreach ($fields as $field) {\n                if ($resItem[$field] === $value[$field]) {\n                    $count++;\n                }\n            }\n            if ($count == count($fields)) {\n                $duplicate = true;\n                break;\n            }\n        }\n        if (!$duplicate) {\n            $res[$key] = $value;\n        }\n    }\n    return $res;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(8), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction filterEmpty(array $array, array $filter) {\n    foreach ($array as $index => &$item) {\n        if (is_array($item)) {\n            $item = self::filterEmpty($item, $filter);\n        }\n        foreach ($filter as $value) {\n            if(is_string($item)) {\n                $item = self::normalizeString($item);\n            }\n            if ($item === $value || empty($item)) {\n                unset ($array[$index]);\n            }\n        }\n    }\n    return $array;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(9), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction find($data, $search, $mostFrequent = true) {\n    if(!is_array($data)) return false;\n    $result = [];\n    foreach ($data as $id => $providerData) {\n        if(!is_array($providerData)) continue;\n        array_walk_recursive($providerData, function ($value, $item) use ($search, &$result) {\n            if ($item == $search) {\n                @$result[$value] ++;\n            }\n        });\n    }\n    if(!empty($result)) {\n        arsort($result);\n        $keys = array_keys($result);\n        return !$mostFrequent ? $keys : $keys[0];\n    }\n    return false;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(10), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\n/**\n * Input array\n * @param array $data\n *\n * If $check is a string, $index must be a string.\n * If $check is an array, function recursively checks $data and removes not matching elements with\n * $check = $check[i][0], $index = $check[i][1], and input $index becomes input $parameter.\n * @param array|string $check\n * @param string|null $index\n *\n * If specified, array will be sorted in descending order by specified sort parameter (usually date).\n * If $check is an array, $parameter becomes $percentage.\n * @param string|null $parameter\n *\n * If specified, search for matching elements will be more soft, according to wanted match percentage.\n * @param int|null $percentage\n * @return array\n */\nfunction getProperValues($data, $check, $index = null, $parameter = null, $percentage = null) {\n    $result = [];\n    if(is_array($check)) {\n        foreach ($check as $item => $value) {\n            $data = self::getProperValues($data, $item, $value, $index, $parameter);\n        }\n        return $data;\n    }\n    if(count($data) > 1) {\n        foreach ($data as $item => $value) {\n            if(!is_null($percentage)) {\n                if(self::compareStrings(@$value[$index], $check, $percentage)) {\n                    $result[] = $value;\n                }\n            } else {\n                if (mb_strtolower($value[$index]) == mb_strtolower($check)) {\n                    $result[] = $value;\n                }\n            }\n        }\n        if($parameter) {\n            usort($result, function($a, $b) use ($parameter) {\n                return strtotime($b[$parameter]) - strtotime($a[$parameter]);\n            });\n        }\n    } else {\n        $result = $data;\n    }\n    return $result;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(11), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<section id=\"header\">\r\n    <nav id=\"w0\" class=\"header navbar navbar-inverse\" role=\"navigation\">\r\n        <div class=\"container\">\r\n            <div class=\"navbar-header\">\r\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#w0-collapse\">\r\n                    <span class=\"sr-only\">Toggle navigation</span>\r\n                    <span class=\"icon-bar\"></span>\r\n                    <span class=\"icon-bar\"></span>\r\n                    <span class=\"icon-bar\"></span>\r\n                    </button>\r\n                    <a class=\"navbar-brand\" href=\"/\">Share your code</a>\r\n            </div>\r\n            <div id=\"w0-collapse\" class=\"collapse navbar-collapse\">\r\n                    <ul id=\"w1\" class=\"navbar-nav navbar-right nav\">\r\n                        <li>\r\n                            <a href=\"/site/logout\" \r\n                            data-method=\"post\">logout (firstUser)</a>\r\n                        </li>\r\n                    </ul>\r\n            </div>\r\n        </div>\r\n    </nav>\r\n</section>", 
		"type": "html" 
	},{
		"id": NumberInt(12), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction merge($data) {\n    $result = self::getEmpty();\n    if (is_array($data)) {\n        foreach ($data as $provider => $item) {\n            if (is_array($item)) {\n                foreach ($item as $key => $value) {\n                    if (is_bool($result[$key])) {\n                        $result[$key] = $result[$key] || $item[$key];\n                    } else if (empty($result[$key]) && !empty($value)) { //provider id = priority\n                        $result[$key] = $value;\n                    }\n                }\n            }\n        }\n    }\n    return $result;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(13), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction makeHTML($arr, $srcOrHref = null) {\n    $result = '';\n    foreach ($arr as $item => $value) {\n        $attributes = '';\n        $inner = '';\n        if(isset($value['attributes'])) {\n            foreach ($value['attributes'] as $kAttribute => $vAttribute) {\n                if($vAttribute === 'value'){\n                    $vAttribute = $srcOrHref;\n                }\n                $attributes .= sprintf('%s=\"%s\" ', $kAttribute, $vAttribute);\n            }\n        }\n        if(isset($value['inner'])) {\n            if(is_string($value['inner'])) {\n                $inner = $value['inner'];\n            } elseif(is_array($value['inner'])) {\n                $inner = $this->makeHTML($value['inner'], $srcOrHref);\n            }\n        }\n        $result .= preg_match(\n            '/^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/',\n                $item) ? sprintf('<%s %s />', $item, $attributes) :\n            sprintf('<%s %s>%s</%s>', $item, $attributes, $inner, $item);\n    }\n    return $result;\n}", 
		"type" : "php" 
	},{
		"id": NumberInt(14), 
		"userId": NumberInt(1), 
		"private": "false", 
		"snippet": "<?php\nfunction convert($data, $template = null) {\n    $template = $template ?? Config::load(__DIR__.'/../../config/order.yml')->get('order');\n    $result = [];\n    foreach ($template as $item => $value) {\n        if(isset($data[$item]) && !empty($data[$item])) {\n            if(isset($value['justAdd'])) {\n                $result[$item] = $data[$item];\n                continue;\n            }\n            if(isset($value['name'])) {\n                if(is_array($value['name'])) {\n                    $value['name'] = $value['name']['name'] . $this->makeHTML($value['name']['html']);\n                }\n                $result[$item]['name'] = $value['name'];\n                if(isset($value['default'])) {\n                    $result[$item]['warning'] = true;\n                }\n                if(isset($value['html'])) {\n                    if(is_array($data[$item])) {\n                        foreach ($data[$item] as $k => $v) {\n                            $result[$item]['inner'] = $this->makeHTML($value['html'], $v);\n                        }\n                    } else {\n                        $result[$item]['inner'] = $this->makeHTML($value['html'], $data[$item]);\n                    }\n                    continue;\n                }\n                if(isset($value['arr'])) {\n                    if(isset($value['arr']['justCount'])) {\n                        $result[$item]['inner'] = [];\n                        foreach ($data[$item] as $i => $v) {\n                            $result[$item]['inner'][$i] = [\n                                'name' => $i+1,\n                                'inner' => isset($value['arr']['html']) ?\n                                    $this->makeHTML($value['arr']['html'], $v) : $v\n                            ];\n                        }\n                        continue;\n                    }\n                    $result[$item]['inner'] = is_array($data[$item]) ? $this->convert($data[$item], $value['arr']) :\n                        ($value['arr'][$data[$item]] ?? null);\n                    continue;\n                }\n                if(isset($value['mdArr'])) {\n                    foreach ($data[$item] as $k => $v) {\n                        $result[$item]['inner']['mdArr'][$k] = $this->convert($v, $value['mdArr']);\n                    }\n                    continue;\n                }\n                if(isset($value['modify'])) {\n                    $result[$item]['inner'] = call_user_func([$this, $value['modify']], $data[$item]);\n                    if(isset($value['format'])) {\n                        $result[$item]['inner'] = sprintf('%s %s', $result[$item]['inner'], $value['format']);\n                    }\n                    continue;\n                }\n                if(isset($value['format'])) {\n                    $data[$item] = sprintf('%s %s', $data[$item], $value['format']);\n                    $value = $value['name'];\n                }\n            }\n            $result[$item]['name'] = $value;\n            $result[$item]['inner'] = $data[$item];\n        } elseif (!isset($data[$item])) {\n            if(isset($value['default'])) {\n                $result[$item]['default']['name'] = $value['default']['name'];\n                $result[$item]['default']['inner'] = $value['default']['description'];\n            }\n        }\n    }\n    return $result;\n}", 
		"type": "php" 
	},{
		"id": NumberInt(15), 
		"userId": NumberInt(2), 
		"private": "true", 
		"snippet": "def hello(user):\n    print ('Hello, %s'% (user))\nhello('Funny Guy')", 
		"type": "python" 
	},{
		"id": NumberInt(16), 
		"userId": NumberInt(2), 
		"private": "false", 
		"snippet": ".content-item {\r\n    padding: 15px 0;\r\n}\r\n.nav-tabs {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n@media (min-width: 1200px) {\r\n    .container {\r\n        width: 1170px;\r\n    }\r\n}", 
		"type": "css" 
}])
db.snippets.createIndex({"id": 1}, {unique: true})