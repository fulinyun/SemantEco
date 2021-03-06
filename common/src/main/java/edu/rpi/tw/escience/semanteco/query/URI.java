package edu.rpi.tw.escience.semanteco.query;

/**
 * Represents a named resource in a Query
 * @author ewpatton
 *
 */
public class URI implements QueryResource {

	private java.net.URI uri = null;
	
	/**
	 * Constructs a new URI object from an existing string.
	 * This should conform to the URI standard represented by
	 * the java.net.util class.
	 * @param uri A UTF-8 encoded string representing a URI
	 */
	public URI(final String uri) {
		String processedUri = uri;
		if(uri.contains(" ")) {
			processedUri = uri.replaceAll(" ", "%20");
		}
		this.uri = java.net.URI.create(processedUri);
	}

	@Override
	public String getUri() {
		return uri.toString();
	}
	
	@Override
	public String toString() {
		return "<"+uri.toString()+">";
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + uri.hashCode();
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		URI other = (URI) obj;
		return uri.equals(other.uri);
	}

}
