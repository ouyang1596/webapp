package myapp;

public class Test {
	public static void main(String[] args) {
		String data = "";
		System.out.println("isFullWidthSpaceOnly==" + isFullWidthSpaceOnly(data));
	}

	public static boolean isFullWidthSpaceOnly(String input) {
		return input.matches("[　]+");
	}
}
