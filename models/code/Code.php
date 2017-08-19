<?php


namespace app\models\code;

use app\models\tools\DB;
use app\models\user\User;
use yii\base\Object;

class Code extends Object
{
    const COLLECTION = 'snippets';

    public $id;
    public $userId;
    public $private;
    public $snippet;
    public $type;

    /**
     * Gets code snippet by id
     * @param int $id
     * @return array|null
     * @throws \Exception
     */

    public static function getSnippetById($id) {
        if(!is_int($id)) {
            throw new \Exception('Id must be number and only number, type: ' . gettype($id));
        }
        $result = DB::findByParameters(self::COLLECTION, [
            'id' => $id
        ]);
        if(!empty($result)) {
            $result['user'] = User::findIdentity($result['userId'])->username;
            return $result;
        }
        return null;
    }

    /**
     * Gets public code snippets
     * @return array|null
     */
    public static function getPublicSnippets() {
        $result = DB::getCut(self::COLLECTION,
            [
                'id' => true,
                'userId' => true,
                'snippet' => [0, 100],
                'private' => true,
                'type' => true
            ], 10, [
                'private' => 'false'
            ]);
        if ($result) {
            foreach ($result as &$item) {
                $item['user'] = User::findIdentity($item['userId'])->username;
                $item['snippet'] = $item['snippet'] . "\r\n//Click to show more";
            }
            return $result;
        }
        return null;
    }

    /**
     * @param User $user
     * @return array|null
     */
    public static function getUserSnippets($user) {
        $result = DB::getCut(self::COLLECTION,[
            'id' => true,
            'userId' => true,
            'snippet' => [0, 100],
            'private' => true,
            'type' => true
        ], null, [
            'userId' => $user->id
        ]);
        if ($result) {
            foreach ($result as &$item) {
                $item['user'] = $user->username;
                $item['snippet'] = $item['snippet'] . "\r\n//Click to show more";
            }
            return $result;
        }
        return null;
    }
}