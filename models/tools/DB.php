<?php


namespace app\models\tools;

use Yii;
use yii\mongodb\Collection;
use yii\mongodb\Query;

class DB
{
    const UNIQUES = ['id', 'username'];
    const ORDER_ASC = 1;
    const ORDER_DESC = -1;

    private static $_collections = ['users', 'snippets', 'test'];

    /**
     * @param string $collection
     * @param array|string $parameters
     * @param int|null $limit
     * @param int|null $order
     * @throws \Exception
     * @return array|null
     */
    public static function findByParameters($collection, $parameters, $limit = 1, $order = SORT_DESC) {
        if (!in_array($collection, self::$_collections)) {
            throw new \Exception("Collection doesn't exist: $collection");
        }
        $query = (new Query())
            ->from($collection)
            ->where($parameters)
            ->orderBy(['id' => $order])
            ->limit($limit);
        $res = $query->all();
        if ($res) {
            foreach ($res as &$value) {
                unset($value['_id']);
            }
            return $limit === 1 ? $res[0] : $res;
        }
        return null;
    }

    public static function lastInsertId($collection) {
        if (!in_array($collection, self::$_collections)) {
            throw new \Exception("Collection doesn't exist: $collection");
        }
        $res = (new Query())
            ->from($collection)
            ->orderBy(['id' => SORT_DESC])->one();
        return isset($res['id']) ? $res['id'] : 0;
    }

    /**
     * @param string $collection
     * @param array $parameters
     * @throws \Exception
     */
    public static function insert($collection, $parameters) {
        if (!in_array($collection, self::$_collections)) {
            throw new \Exception("Collection doesn't exist: $collection");
        }
        /** @var Collection $coll */
        $coll = Yii::$app->mongodb->getCollection($collection);
        $coll->insert($parameters);
        if($parameters['id'] == 1) {
            $uniques = [];
            foreach ($parameters as $name => $value) {
                if(in_array($name, self::UNIQUES)) {
                    $uniques[] = ['key' => [$name => 1], 'unique' => true];
                }
            }
            !empty($uniques['key']) ?: $coll->createIndexes($uniques);
        }
    }

    /**
     * @param string $collection
     * @param array $fields
     * @param int $limit
     * @param array|null $matchArr
     * @param int|null $order
     * @return array
     * @throws \Exception
     */
    public static function getCut($collection, $fields, $limit, $matchArr = null, $order = self::ORDER_DESC) {
        if (!in_array($collection, self::$_collections)) {
            throw new \Exception("Collection doesn't exist: $collection");
        }
        $cuttingArr = [];
        foreach ($fields as $field => $cutSize) {
            if(is_array($cutSize)) {
                $substrParams = array_merge(['$' . $field], $cutSize);
                $cuttingArr = array_replace($cuttingArr, [$field => ['$substr' => $substrParams]]);
            } else {
                $cuttingArr = array_replace($cuttingArr, [$field => $cutSize]);
            }
        }
        $parts = [];
        if(is_array($matchArr)) {
            $parts[] = ['$match' => $matchArr];
        }
        if($order) {
            $parts[] = ['$sort' => ['id' => $order]];
        }
        if($limit) {
            $parts[] = ['$limit' => $limit];
        }
        $parts[] = [
            '$project' => $cuttingArr
        ];
        /** @var Collection $coll */
        $coll = Yii::$app->mongodb->getCollection($collection);
        $result = $coll->aggregate($parts);
        return $result;
    }
}