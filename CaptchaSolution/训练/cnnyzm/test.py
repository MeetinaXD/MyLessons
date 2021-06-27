import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()
from train import cnn_graph
from process import vec2text,convert2gray,wrap_gen_captcha_text_and_image
from getimg import CAPTCHA_HEIGHT, CAPTCHA_WIDTH, CAPTCHA_LEN, CAPTCHA_LIST,load_image

import numpy as np
import random

# 验证码图片转化为文本
def captcha2text(image_list, height=CAPTCHA_HEIGHT, width=CAPTCHA_WIDTH):
    x = tf.placeholder(tf.float32, [None, height * width])
    
    keep_prob = tf.placeholder(tf.float32)
    y_conv = cnn_graph(x, keep_prob, (height, width))
    saver = tf.train.Saver()
    with tf.Session() as sess:
        saver.restore(sess, tf.train.latest_checkpoint('.'))
        predict = tf.argmax(tf.reshape(y_conv, [-1, CAPTCHA_LEN, len(CAPTCHA_LIST)]), 2)
        vector_list = sess.run(predict, feed_dict={x: image_list, keep_prob: 1})
        vector_list = vector_list.tolist()

        text_list = [vec2text(vector) for vector in vector_list]
        builder = tf.saved_model.builder.SavedModelBuilder("./saved_model/")
        builder.add_meta_graph_and_variables(sess, ['cnnCaptcha'])
        builder.save()
        return text_list

if __name__ == '__main__':
    def returnTextAndImage():
        return ['b667'], [load_image('./yzm2.jpg')]
    # text, image = returnTextAndImage()
    text, image = wrap_gen_captcha_text_and_image()
    text_a = random.choice(text)
    image_a = image[text.index(text_a)]
    img_array = np.array(image_a)
    image = convert2gray(img_array)
    image = image.flatten() / 255
    pre_text = captcha2text([image])
    if pre_text[0] == text_a:
        print("\033[1;37;46m正确验证码:%s, 识别出来的:%s\tTRUE\033[0m" % (text_a,pre_text[0]))
        # print(' 正确验证码:', text_a, "识别出来的：", pre_text,"  TURE")
    else:
        print("\033[1;37;40m正确验证码:%s, 识别出来的:%s\tFALSE\033[0m" % (text_a,pre_text[0]))
        # print(' 正确验证码:', text_a, "识别出来的：", pre_text, "FLASE")