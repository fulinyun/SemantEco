package edu.rpi.tw.escience.semanteco.test;

import org.apache.log4j.Logger;

import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.rdf.model.Model;

import edu.rpi.tw.escience.semanteco.Request;

/**
 * MockRequest provides a base implementation of
 * the Request object for unit tests. All methods
 * throw UnsupportedOperationException by default
 * unless explicitly overridden by a subclass.
 * @author ewpatton
 *
 */
public class MockRequest implements Request {

	@Override
	public Object getParam(String key) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Logger getLogger() {
		throw new UnsupportedOperationException();
	}

	@Override
	public OntModel getModel() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Model getDataModel() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Model getCombinedModel() {
		throw new UnsupportedOperationException();
	}

}
