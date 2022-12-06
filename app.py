""" imports para mover el servo """
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD) # Configuramos las salidas para el GPIO
GPIO.setup(35, GPIO.OUT) #Servo
GPIO.setup(36, GPIO.OUT)  #Dispensador
GPIO.setup(37, GPIO.IN) # Echo
GPIO.setup(38, GPIO.OUT) # Trigger
servo1 = GPIO.PWM(36, 50) # pin 36 para servo1, pulso 50Hz
servo1.start(0) #Iniciamos en pulso off apagado

def medirDistancia():
    GPIO.output(38, True)
    time.sleep(0.00001)
    GPIO.output(38, False)
    start = time.time()
    while GPIO.input(37)==0:
        start = time.time()
    while GPIO.input(37)==1:
        stop = time.time()
    elapsed = stop-start
    distance = (elapsed * 34300)/2 # 34300 cm/s,
    return distance

def mediaDistancia():
    distancia = 0
    for i in range(0,3):
        print("Medida: ", i)
        distancia += medirDistancia()
        time.sleep(0.1)
    distancia = distancia / 3
    return distancia

def move_servo(angle):
    duty = angle / 18 + 2
    GPIO.output(35, True)
    servo1.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(35, False)
    servo1.ChangeDutyCycle(0)
    """
    duty = (angle / 18) + 2 # 0 grados = 2, 180 grados = 12
    servo1.ChangeDutyCycle(duty) #Lo movemos a cierto angulo
    time.sleep(0.5)
    servo1.ChangeDutyCycle(0) #Apagamos el pulso, se queda ahí
    """
""" Iniciamos el servidor de socketio """
import socketio
""" iniciamos server de socketio """
sio = socketio.Server(cors_allowed_origins="*") #Que vengan datos de donde sea

app = socketio.WSGIApp(sio)
""" Ejemplo de un evento """
@sio.event
def connect(sid, environ):
    print('Conexión Establecsida', sid)

@sio.event
def disconnect():
    print('Conexión Establecida')

@sio.event
def detection(sid, data):
    print('Mensaje recibido', data)
    """ Vamos a recibir un json con {'id'}, si el id corresponde entonces movemos 90 grados """
    if data['id'] == 1:
        """ Antes de mover el servo, tenemos que dispensar liquido """
        """ Para eso tenemos que cambiar el estado del pin 36 a True """
        """ Pero antes de eso, debemos verificar que la distancia sea menor a 10 """
        while mediaDistancia() > 10:
          print("Distancia: ", mediaDistancia())
          print("No mover")
        """ Se supone que en este punto, la mediaDistancia es menor a 10, por lo tanto puso las manos """
        GPIO.output(36, True)
        time.sleep(3)
        GPIO.output(36, False)
        print("Identificación realizada, moviendo servo")
        move_servo(90)
        sio.emit('servo', {'id': 1, 'status': 'movio'}) #TODO: no olvidar handlear esto en frontend
        time.sleep(5) #Esperamos 5 segundos para que el servo se mueva y pase la persona
        """ Cerramos el servo """
        move_servo(0)
    else:
        print("Otro id, no se mueve")





