<?php


namespace app\controllers;

use app\models\code\CodeForm;
use Yii;
use yii\base\Exception;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class AjaxController extends Controller
{

    /**
     * @inheritdoc
     */
    public function behaviors() {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => [
                    'addSnippet',
                ],
                'rules' => [
                    [
                        'actions' => [
                            'addSnippet',
                        ],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'addSnippet' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */

    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
                'exceptionView' => 'error.twig',
                'errorView' => 'error.twig',
            ]
        ];
    }

    /**
     * Add snippet.
     *
     * @return Response|string
     * @throws \Exception
     */

    public function actionAddSnippet() {
        if (Yii::$app->request->isPost) {
            if (Yii::$app->user->isGuest) {
                throw new Exception('Only logged in users may add snippets');
            }
            $model = new CodeForm();
            if ($model->load(Yii::$app->request->post(), '') && $model->addSnippet()) {
                return $this->goBack();
            }
            return $this->asJson(['error' => $model->errors]);
        }
        throw new NotFoundHttpException('Page not found.');
    }

}