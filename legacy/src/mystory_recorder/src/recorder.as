import mx.controls.Alert;
import mx.core.Application;
import flash.events.Event;
import flash.external.ExternalInterface;
import flash.media.Camera;
import flash.utils.Timer;
import mx.core.FlexGlobals;

NetConnection.defaultObjectEncoding = flash.net.ObjectEncoding.AMF3;
SharedObject.defaultObjectEncoding  = flash.net.ObjectEncoding.AMF3;

public var connection:NetConnection;

public var inputStream:NetStream;

public var camera:Camera;

public var mic:Microphone;

public var outputStream:NetStream;

public var recordingTimer:Timer = new Timer( 1000 , 0 );

public var serverURL:String;


public function init():void {
	state("init:start");
	recordingTimer.addEventListener("timer" , publishTime);
	ExternalInterface.addCallback("alert", alert);
	ExternalInterface.addCallback("startRecording", startRecording);
	ExternalInterface.addCallback("stopRecording", stopRecording);
	if(FlexGlobals.topLevelApplication.parameters.serverURL!=null) {
		connect(FlexGlobals.topLevelApplication.parameters.serverURL);
	}
	state("init:completed");
}

public function connect(serverURL:String):void {
	state("connect:start");
	this.serverURL = serverURL;
	connection=new NetConnection();		
	connection.client=this;		
	connection.addEventListener(NetStatusEvent.NET_STATUS,netStatusHandler);
	connection.connect(serverURL);
	state("connect:completed");
} 

public function onBWDone(arg):void { 
	
	};

public function onBWCheck(arg):void {}
private function netStatusHandler(event:NetStatusEvent):void {
	state("net_status:start");
	switch (event.info.code) {
	case "NetConnection.Connect.Failed":
		Alert.show("ERROR:Could not connect to: "+this.serverURL);
	break;	
    case "NetConnection.Connect.Success":
    	prepareStreams();
    break;
	default:
		connection.close();
		break;
    }
	state("net_status:completed");
}

public function alert(str:String):void { 
	Alert.show(str);
	state(str);
}

private function state(newState:String): void {
	ExternalInterface.call("onStateChange", newState);
}

private  function publishTime( event:TimerEvent ):void {
	ExternalInterface.call("onTimeChange", event.target);
}

public function startRecording(filename:String):void {
	recordingTimer.reset();
	state("startRecording:start");
	outputStream.publish(filename, "record");
	outputStream.attachCamera(camera);
	outputStream.attachAudio(mic);
	recordingTimer.start();
	state("startRecording:completed");
}
public function stopRecording():void {
	state("stopRecording:start");
	recordingTimer.stop();
	outputStream.close();
	state("stopRecording:completed");
}


private function prepareStreams():void {
	state("prepareStreams:start");
	outputStream = new NetStream(connection); 
	camera=Camera.getCamera();
	if (camera==null) {
		Alert.show("Webcam not detected!");
	}
	if (camera!=null) {
		if (camera.muted) 	{
			Security.showSettings(SecurityPanel.DEFAULT);
		}
		camera.setKeyFrameInterval(15);
		camera.setMode(FlexGlobals.topLevelApplication.width, FlexGlobals.topLevelApplication.height, 25, false);
		//camera.setMode(320, 240, 30, true);
		camera.setQuality(0, 85);
		videoDisplay.attachCamera(camera);
		camera.addEventListener(StatusEvent.STATUS, publishCameraStatus); 
	}	

	mic=Microphone.getMicrophone(0);
	if (mic!=null) {
        mic.rate=22;
        var timer:Timer=new Timer(50);
		timer.addEventListener(TimerEvent.TIMER, publishRecordingStatus);
		timer.start();
	}	
	state("prepareStreams:completed");
}   
private function publishCameraStatus(event:StatusEvent):void {
	ExternalInterface.call("onCameraChange", event);
} 
private function publishRecordingStatus(event:TimerEvent):void {
	ExternalInterface.call("onRecordingStatus", mic, camera);	
}
