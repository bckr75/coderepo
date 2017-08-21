<?php


namespace app\models\user;

use app\models\tools\DB;
use Yii;
use yii\base\Model;

/**
 * RegisterForm is the model behind the user register form.
 *
 * @property array|null $_userParams This property is read-only.
 *
 */
class RegisterForm extends Model
{
    const USERNAME_PATTERN = '/[a-zA-Z0-9]{6,32}/';
    const PASSWORD_PATTERN = '/^[0-9a-zA-Z!@#$%^&*()_+|}{":?><~`\-\=\[\]\';\/.,\\№]{8,32}$/';

    public $username;
    public $password;

    private $_userParams = [];

    /**
     * @return array the validation rules.
     */
    public function rules() {
        return [
            [['username', 'password'], 'required'],
            ['password', 'validatePassword'],
            ['username', 'validateUsername'],
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword($attribute, $params) {
        if (!$this->hasErrors()) {
            if (!is_string($this->password) && preg_match(self::PASSWORD_PATTERN, $this->password)) {
                $this->addError($attribute, 'Password may only consist of latin characters, numbers 
            and special characters like "!@#" and must have length between 8 and 32 characters');
            }
        }
    }

    /**
     * Validates the username.
     * This method serves as the inline validation for username.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validateUsername($attribute, $params) {
        if (!$this->hasErrors()) {
            if (!is_string($this->username) && preg_match(self::USERNAME_PATTERN, $this->username)) {
                $this->addError($attribute, 'Username must consist of latin characters and/or numbers and have 
                length from 6 to 32 characters');
            }
            if (User::findByUsername($this->username)) {
                $this->addError($attribute, 'User with specified username already exists, try another one.');
            }
        }
    }

    /**
     * Adds new user to collection users and, after that, user will be logged in.
     * Password will be saved as bcrypt hash for security reasons.
     * @return bool
     */
    public function register() {
        if($this->validate()) {
            $id = DB::lastInsertId('users') + 1;
            $this->_userParams = [
                'id' => $id,
                'username' => $this->username,
                'password' => password_hash($this->password, PASSWORD_DEFAULT),
                'authKey' => 'test' . $id . 'key',
                'accessToken' => $id . '-token'
            ];
            DB::insert('users', $this->_userParams);
            return Yii::$app->user->login(new User($this->_userParams),  3600*24*30);
        }
        return false;
    }
}