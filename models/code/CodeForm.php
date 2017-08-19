<?php


namespace app\models\code;

use app\models\tools\DB;
use Yii;
use yii\base\Model;

/**
 * CodeForm is the model behind the add code snippet form.
 *
 *
 */
class CodeForm extends Model
{

    public $snippet;
    public $private = false;
    public $type;
    
    private static $_langTypes = ['c_cpp', 'css', 'coffee', 'diff', 'html', 'xml', 'java', 'javascript', 'markdown',
        'objectivec', 'php', 'perl', 'python', 'ruby', 'sql', 'sh'];

    /**
     * @return array the validation rules.
     */
    public function rules() {
        return [
            [['snippet', 'private', 'type'], 'required'],
            ['snippet', 'validateSnippet'],
            ['type', 'validateType'],
            ['private', 'validatePrivate'],
        ];
    }

    /**
     * Validates code snippet.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validateSnippet($attribute, $params) {
        if (!$this->hasErrors()) {
            if(empty($this->snippet)) {
                $this->addError($attribute, 'Snippet is empty');
            }
            if (!is_string($this->snippet)) {
                $this->addError($attribute, 'Invalid snippet type, contact the site admin');
            }
        }
    }

    /**
     * Validates field 'private'.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePrivate($attribute, $params) {
        if (!$this->hasErrors()) {
            if(empty($this->private)) {
                $this->addError($attribute, 'Parameter "private" is empty');
            }
            if (!is_string($this->private)) {
                $this->addError($attribute, 'Parameter "private" must be of type string');
            }
        }
    }

    /**
     * Validates field 'type'.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validateType($attribute, $params) {
        if (!$this->hasErrors()) {
            if(empty($this->type)) {
                $this->addError($attribute, 'Parameter "type" is empty');
            }
            if (!is_string($this->type)) {
                $this->addError($attribute, 'Parameter "type" must be of type string');
            }
            if (!in_array($this->type, self::$_langTypes)) {
                $this->addError($attribute, 'Invalid language type');
            }
        }
    }

    /**
     *  Adds user code snippet
     */
    public function addSnippet() {
        if ($this->validate()) {
            DB::insert(Code::COLLECTION, [
                'id' => DB::lastInsertId(Code::COLLECTION) + 1,
                'userId' => Yii::$app->user->id,
                'private' => $this->private,
                'snippet' => $this->snippet,
                'type' => $this->type
            ]);
            return true;
        }
        return false;
    }
}