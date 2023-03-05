import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../../actions/authAction"

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname;
	const dispatch = useDispatch();
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
	const handleLogout = () => {
		dispatch( logout(navigate) );
		setUser(null);
	}
	useEffect( () => {
		setUser(JSON.parse(localStorage.getItem('profile')));
	}, [location]);
	
    return (
	<>
	<div class="d-flex flex-column flex-shrink-0 p-3 border border-right border-primary" style={{width: "280px",height:"100vh", float:"left"}}>
		<a href="/" class="navbar-brand d-flex align-items-center mb-3 mb-md-0 me-md-auto fs-2">
			<i class="bi bi-truck me-1 text-primary"></i>
			<span>UWC Remake</span>
		</a>
		<hr/>
		<ul class="nav nav-pills flex-column mb-auto">
			<li class="nav-item">
				<Link to="/"  class={path=="/" ? "nav-link active" : "nav-link"}>
					<i class="bi bi-bar-chart me-3"></i>
					<span>Tổng quan</span>
				</Link>
			</li>
			<li>
				<button class="btn btn-toggle align-items-center rounded collapsed text-primary" data-bs-toggle="collapse" data-bs-target="#stuff-collapse">
					<i class="bi bi-briefcase me-3"></i>
					<span>Thiết bị</span>
				</button>
				<div id="stuff-collapse" class="collapse text-primary">
					<ul class="btn-toggle-nav list-unstyled pb-1 ms-3">
						<li><Link to="/users" class={path=="/users" ? "nav-link active" : "nav-link"}>Nhân viên</Link></li>
						<li><Link to="/trucks" class={path=="/trucks" ? "nav-link active" : "nav-link"}>Phương tiện</Link></li>
						<li><Link to="/mcps" class={path=="/mcps" ? "nav-link active" : "nav-link"}>MCP</Link></li>
					</ul>
				</div>
			</li>
			<li>
				<Link to="/tasks" class={path=="/tasks" ? "nav-link active" : "nav-link"}>
					<i class="bi bi-person me-3"></i>
					<span>Phân công</span>
				</Link>
			</li>
			<li>
				<Link to="/map" class={path=="/map" ? "nav-link active" : "nav-link"}>
					<i class="bi bi-map me-3"></i>
					<span>Bản đồ</span>
				</Link>
			</li>
            <li>
				<Link to="/chats" class={path=="/chats" ? "nav-link active" : "nav-link"}>
                <i class="bi bi-chat-right-text me-3"></i>
					<span>Tin nhắn</span>
				</Link>
			</li>
		</ul>
		<hr/>
		<ul class="nav nav-tabs flex-column text-muted mb-4">
			<li class="nav-item active">
				<a href="#" class="nav-link">
					<i class="bi bi-exclamation me-3"></i>
					<span>Trợ giúp</span>
				</a>
			</li>
			<li class="nav-item">
				<a href="#" class="nav-link">
					<i class="bi bi-chat-dots me-3"></i>
					<span>Liên hệ</span>
				</a>
			</li>
		</ul>
		<div class="container">
			{user  ? (<div class="dropdown">
				<div class="d-flex align-items-center text-decoration-none dropdown-toggle show" data-bs-toggle="dropdown">
					<img src={user?.image} class="rounded-circle me-2" width="32" height="32"/>
					<strong>{user.name}</strong>					
				</div>
				<ul class="dropdown-menu text-small shadow">
					<li class="dropdown-item">
						<Link to="/auth" class="text-decoration-none">Change account</Link>
					</li>
					<li>
						<hr class="dropdown-divider"></hr>
					</li>
					<li class="dropdown-item" onClick={handleLogout}>Logout</li>
				</ul>
				</div> ) : (
				<Link to="/auth">
					<button class="btn btn-primary" role="button">Sign In</button>
				</Link>
				
			)}
			
			
    	</div>
	</div>
  
  
	</>
    )};

export default Navbar;