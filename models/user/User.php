<?php

namespace app\models\user;

use app\models\tools\DB;
use yii\base\Object;
use yii\web\IdentityInterface;

class User extends Object implements IdentityInterface
{
    const COLLECTION = 'users';
    public $id;
    public $username;
    public $password;
    public $authKey;
    public $accessToken;

    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        $res = DB::findByParameters(self::COLLECTION, ['id' => $id]);
        return $res ? new static($res) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        $res = DB::findByParameters(self::COLLECTION, ['accessToken' => $token]);
        return $res ? new static($res) : null;
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        $res = DB::findByParameters(self::COLLECTION, ['username' => $username]);
        return $res ? new static($res) : null;
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->authKey;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->authKey === $authKey;
    }

    /**
     * Validates password with password hash in database.
     *
     * @param string $password - password to validate
     * @return bool - true if password provided is valid for current user, otherwise false.
     */
    public function validatePassword($password)
    {
        return password_verify($password, $this->password);
    }

}
